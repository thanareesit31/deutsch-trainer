import Foundation
import PDFKit
import AppKit

let arguments = CommandLine.arguments
guard arguments.count > 2,
      let document = PDFDocument(url: URL(fileURLWithPath: arguments[1])) else {
  fputs("Usage: swift read-pdf.swift <pdf> <page> [page...]\n", stderr)
  exit(1)
}

for argument in arguments.dropFirst(2) {
  guard let pageNumber = Int(argument),
        let page = document.page(at: pageNumber - 1) else {
    fputs("Invalid PDF page: \(argument)\n", stderr)
    exit(1)
  }
  print("=== PDF PAGE \(pageNumber) ===")
  let pageText = page.string?.trimmingCharacters(in: .whitespacesAndNewlines) ?? ""
  if pageText.isEmpty {
    let image = page.thumbnail(of: NSSize(width: 4000, height: 5600), for: .mediaBox)
    guard let tiff = image.tiffRepresentation,
          let bitmap = NSBitmapImageRep(data: tiff),
          let png = bitmap.representation(using: .png, properties: [:]) else {
      fputs("Could not render PDF page \(pageNumber)\n", stderr)
      exit(1)
    }
    let output = URL(fileURLWithPath: ".tools/a13-source-pages/\(URL(fileURLWithPath: arguments[1]).deletingPathExtension().lastPathComponent)-\(pageNumber).png")
    try FileManager.default.createDirectory(at: output.deletingLastPathComponent(), withIntermediateDirectories: true)
    try png.write(to: output)
    print("Rendered: \(output.path)")
  } else {
    print(pageText)
  }
}
