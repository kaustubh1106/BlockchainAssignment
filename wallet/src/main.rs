use secp256k1::rand::rngs::OsRng;
use secp256k1::{Secp256k1,SecretKey,Message};
use serde::{ Deserialize, Serialize};
use std::fs;
use serde_json;
use std::str::FromStr;
use clap::{ Parser, Subcommand};
use secp256k1::hashes::{sha256, Hash};

const WALLET_FILE: &str = "wallet.json";

#[derive(Serialize, Deserialize)]
struct Wallet {
    secret_key: String,
    public_key: String,
}

#[derive(Parser)]
struct CLI {
    #[clap(subcommand)]
    subcmd: Commandenum,
}

#[derive(Subcommand)]
enum Commandenum {
    Generate,
    Show,
    Sign {
        message: String,
    },
    Verify {
        message: String,
        signature: String,
        public_key: String,
    },
}

//3045022100f79a8a79a1dbf289552430ede2d0f5cb9985fe7b9fcd555eaa75ba72404655ea02205dfe9d400e7cfdadcef780c34289a7bb3f5fddab314505c5b259327a980f755a
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
    println!("please run: crago run -- <command>");
    let cli = CLI::parse();
    match cli.subcmd {
        Commandenum::Generate => {
            generate();
        }
        Commandenum::Show => {
           match show_wallet() {
               Some(key) => println!("Public Key: {}", key),
               None => println!("No wallet found")
           }
        }
        Commandenum::Sign { message } => {
            let wallet = fs::read_to_string(WALLET_FILE).unwrap();
            let wallet: Wallet = serde_json::from_str(&wallet).unwrap();
            let check = sign(&message,&wallet.secret_key) ;
            if check.is_empty(){
                println!("Error signing message");
            }else{
                println!("Signature: {}", check);
            }
        }
        Commandenum::Verify { message, signature, public_key } => {

            let check = verify(&message, &signature, &public_key);
            if check {
                println!("Signature is valid");
            } else {
                println!("Signature is invalid");
                
            }
        }
        
    }
}

