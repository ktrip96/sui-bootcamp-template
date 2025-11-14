module accra::bootcamp_nft;



// The creator bundle: these two packages often go together.
use sui::package;
use sui::display;
use sui::table::{Self, Table};
use sui::coin::Coin;
use sui::sui::SUI;
use sui::coin;


const EAlreadyMinted: u64 = 0;
const EMaxSupplyReached: u64 = 1;
const EIncorrectPayment: u64 = 2;
const MINT_PRICE:u64 = 100000000;
const MINT_LIMIT:u64 = 28;


 /// The NFT struct for our simple "Test" NFT.
public struct BootcampNFT has key, store {
    id: UID,
   
}

/// A shared object to track which addresses have minted.
public struct MintTracker has key {
    id: UID,
    // The table maps a user's address to a dummy value (unit `()`).
    // The existence of an entry is the proof of mint.
    records: Table<address, u8>,
    // Vector to store all minted addresses for easy iteration and display
    minted_addresses: vector<address>,
    mint_count: u64,
    mint_limit: u64,
    price: u64, 
    recipient: address
}

// OTW
public struct BOOTCAMP_NFT has drop {}

fun init(otw: BOOTCAMP_NFT, ctx: &mut TxContext){
    let keys = vector [ 
          b"name".to_string(),
            b"description".to_string(),
            b"image_url".to_string(),


    ];


     let values = vector[
            // The template fields will be replaced by the NFT's properties.
            b"Sui Ghana 2025".to_string(),
            b"This unique  NFT that proofs you attended the Sui Ghana 2025 Bootcamp".to_string(),
            b"https://pbs.twimg.com/profile_images/1844748061924311045/0d32o-lD.jpg".to_string(), // Using IPFS for images
        ];




         // Claim the `Publisher` for the package!
    let publisher = package::claim(otw, ctx);


    let mut display = display::new_with_fields<BootcampNFT>(
        &publisher, keys, values, ctx
    );

    let tracker = MintTracker {
            id: object::new(ctx),
            records: table::new(ctx),
            minted_addresses: vector::empty<address>(),
            mint_count: 0,
            mint_limit: MINT_LIMIT,
            price: MINT_PRICE,
            recipient: tx_context::sender(ctx)
        };

    // Commit first version of `Display` to apply changes.
    display.update_version();

    transfer::public_transfer(publisher, ctx.sender());
    transfer::public_transfer(display, ctx.sender());

    transfer::share_object(tracker);
}


/// Anyone can mint their `Hero`!
public fun mint( tracker: &mut MintTracker, payment: Coin<SUI>, ctx: &mut TxContext): BootcampNFT {

    let sender = tx_context::sender(ctx);

    // Check if the sender has already minted.
    assert!(!table::contains(&tracker.records, sender), EAlreadyMinted);


    // Check if we have reached the max supply.
    assert!(tracker.mint_count < tracker.mint_limit, EMaxSupplyReached);

    // Verify the payment amount.
    let amount = coin::value(&payment);
    assert!(amount >= tracker.price, EIncorrectPayment);

    tracker.mint_count = tracker.mint_count + 1;
    table::add(&mut tracker.records, sender, 1);
    vector::push_back(&mut tracker.minted_addresses, sender);
    transfer::public_transfer(payment, tracker.recipient);

    BootcampNFT {
        id: object::new(ctx)    
    }
}

