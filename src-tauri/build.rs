use std::fs;
use std::path::PathBuf;

fn ensure_placeholder_dist_assets() {
    let manifest_dir = std::env::var("CARGO_MANIFEST_DIR").ok();
    let Some(manifest_dir) = manifest_dir else {
        return;
    };

    let dist_dir = PathBuf::from(manifest_dir).join("..").join("dist");
    let assets_dir = dist_dir.join("assets");
    let placeholder = assets_dir.join("tauri-test-placeholder.txt");

    if placeholder.exists() {
        return;
    }

    if fs::create_dir_all(&assets_dir).is_err() {
        return;
    }

    let _ = fs::write(
        &placeholder,
        "Generated placeholder asset for cargo test environments without a built frontend.\n",
    );
}

fn main() {
    ensure_placeholder_dist_assets();
    tauri_build::build()
}
