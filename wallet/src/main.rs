use secp256k1::rand::rngs::OsRng;
use secp256k1::{Secp256k1,SecretKey,Message};
// use secp256k1::ecdsa::Signature;
use serde::{ Deserialize, Serialize};
use std::fs;
use serde_json;
use std::str::FromStr;

use secp256k1::hashes::{sha256, Hash};

const WALLET_FILE: &str = "wallet.json";

#[derive(Serialize, Deserialize)]
struct Wallet {
    secret_key: String,
    public_key: String,
}
fn generate()-> Wallet {
    let secp = Secp256k1::new();
    let (secret_key, public_key) = secp.generate_keypair(&mut OsRng);
    let wallet = Wallet {
        secret_key: secret_key.display_secret().to_string(),
        public_key: public_key.to_string(),
    };
    fs::write(WALLET_FILE, serde_json::to_string_pretty(&wallet).unwrap()).unwrap();
    wallet
}

fn show_wallet() -> Option<String> {
    let wallet = fs::read_to_string(WALLET_FILE).unwrap();
    let wallet: Wallet = serde_json::from_str(&wallet).unwrap();
    Some( wallet.public_key)
}

fn sign(message:&str,private_key:&str )->String{
    let skep = Secp256k1::new();
    let secret_key = SecretKey::from_str(private_key).expect("Invalid private key");
    let digest = sha256::Hash::hash(message.as_bytes());
    let message = Message::from_digest(digest.to_byte_array());
    let sig = skep.sign_ecdsa(&message, &secret_key);
    sig.to_string()
}

fn verify(message:&str,signature:&str,public_key:&str)->bool{
    let secp = Secp256k1::new();
    let public_key = secp256k1::PublicKey::from_str(public_key).expect("Invalid public key");
    let digest = sha256::Hash::hash(message.as_bytes());
    let message = Message::from_digest(digest.to_byte_array());
    let signature = secp256k1::ecdsa::Signature::from_str(signature).expect("Invalid signature");
    secp.verify_ecdsa(&message, &signature, &public_key).is_ok()
}

fn main() {
    println!("Hello, world!");
    generate();
    match show_wallet() {
        Some(key) => println!("Public Key: {}", key),
        None => println!("No wallet found. Create one using `generate`.")
    }   
}

