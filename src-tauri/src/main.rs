// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            enumerate_paragraphs,
            handle_word_click
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

use tauri::command;
use tauri::WindowBuilder;

#[derive(Clone, serde::Serialize)]
struct Paragraph {
    number: usize,
    text: String,
}

#[derive(serde::Deserialize)]
struct ClickedElement {
    tag_name: String,
    text_content: String,
    id: String,
}

#[command]
fn enumerate_paragraphs() -> Vec<Paragraph> {
    let current_dir = std::env::current_dir().expect("Failed to get current directory");
    let file_path = current_dir.join("../src/index.html");
    let content = std::fs::read_to_string(file_path).expect("Failed to read HTML file");

    let doc = scraper::Html::parse_document(&content);
    let paragraphs = scraper::Selector::parse("p.is-text").unwrap();

    doc.select(&paragraphs)
        .enumerate()
        .map(|(index, element)| Paragraph {
            number: index + 1,
            text: element.text().collect(),
        })
        .collect()
}

#[command]
fn handle_word_click(elm: ClickedElement) {
    
}