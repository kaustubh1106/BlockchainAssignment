use secp256k1::rand::rngs::OsRng;
use secp256k1::Secp256k1;
use serde::{ Deserialize, Serialize};
use std::fs;
use serde_json;

const WALLET_FILE: &str = "wallet.json";

#[derive(Serialize, Deserialize)]
struct Wallet {
    secret_key: String,
    public_key: String,
}
fn generate()-> Wallet {
    let secp = Secp256k1::new();
    let (secret_key, public_key) = secp.generate_keypair(&mut OsRng);
    println!("Secret key: {:?}", secret_key);
    println!("Public key: {:?}", public_key);
    let wallet = Wallet {
        secret_key: secret_key.display_secret().to_string(),
        public_key: public_key.to_string(),
    };
    fs::write(WALLET_FILE, serde_json::to_string_pretty(&wallet).unwrap()).unwrap();
    wallet
}

fn show_wallet() -> Option<Wallet> {
    let wallet = fs::read_to_string(WALLET_FILE).unwrap();
    let wallet: Wallet = serde_json::from_str(&wallet).unwrap();
    Some(wallet)
}

fn main() {
    println!("Hello, world!");
    generate();
    if let Some(wallet) = show_wallet() {
        println!("Public Key: {}", wallet.public_key);
    } else {
        println!("No wallet found. Create one using `generate`.");
    }
}

