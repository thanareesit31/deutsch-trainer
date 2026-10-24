import AppKit
import Foundation
import PDFKit
import Vision

let arguments = CommandLine.arguments
guard arguments.count >= 4,
      let document = PDFDocument(url: URL(fileURLWithPath: arguments[1])) else {
  fputs("Usage: swift ocr-pdf.swift <pdf> <output.json> <page> [page...]\n", stderr)
  exit(1)
}

struct PageText: Codable {
  let pdfPage: Int
  let text: String
}

var pages: [PageText] = []
for pageArgument in arguments.dropFirst(3) {
  guard let number = Int(pageArgument), number > 0, let page = document.page(at: number - 1) else {
    fputs("Invalid PDF page: \(pageArgument)\n", stderr)
    exit(1)
  }
  if let text = page.string?.trimmingCharacters(in: .whitespacesAndNewlines), !text.isEmpty {
    pages.append(PageText(pdfPage: number, text: text))
    continue
  }
  let thumbnail = page.thumbnail(of: NSSize(width: 1100, height: 1550), for: .mediaBox)
  var rectangle = CGRect(origin: .zero, size: thumbnail.size)
  guard let image = thumbnail.cgImage(forProposedRect: &rectangle, context: nil, hints: nil) else {
    fputs("Could not render PDF page \(number)\n", stderr)
    exit(1)
  }
  let request = VNRecognizeTextRequest()
  request.recognitionLevel = .accurate
  request.recognitionLanguages = ["de-DE", "en-US"]
  request.usesLanguageCorrection = true
  try VNImageRequestHandler(cgImage: image).perform([request])
  let observations = request.results as? [VNRecognizedTextObservation] ?? []
  let text = observations.compactMap { $0.topCandidates(1).first?.string }.joined(separator: "\n")
  pages.append(PageText(pdfPage: number, text: text))
  print("page \(number): \(text.count) characters")
}

let output = URL(fileURLWithPath: arguments[2])
try FileManager.default.createDirectory(at: output.deletingLastPathComponent(), withIntermediateDirectories: true)
let encoder = JSONEncoder()
encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
try encoder.encode(pages).write(to: output)
