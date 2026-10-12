import os
import markdown
import subprocess

html_template = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Campus IT Help Desk - Final Year Project Report</title>
<style>
  @page {
    size: A4;
    margin: 20mm 15mm 20mm 15mm;
    @bottom-center {
      content: counter(page);
    }
  }

  body {
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
    color: #1e293b;
    line-height: 1.65;
    font-size: 11pt;
    background: #ffffff;
    margin: 0;
    padding: 0;
  }

  /* Academic Cover Page */
  .cover-page {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    padding: 40px 20px;
    height: 92vh;
    border: 4px double #1e293b;
    margin-bottom: 50px;
    page-break-after: always;
  }

  .cover-header {
    margin-top: 20px;
  }

  .cover-title {
    font-size: 24pt;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.5px;
    text-transform: uppercase;
    margin: 15px 0 10px 0;
    line-height: 1.25;
  }

  .cover-subtitle {
    font-size: 13pt;
    font-weight: 600;
    color: #2563eb;
    margin-bottom: 25px;
    max-width: 650px;
    line-height: 1.4;
  }

  .cover-meta {
    font-size: 11pt;
    color: #475569;
    border-top: 1px solid #cbd5e1;
    border-bottom: 1px solid #cbd5e1;
    padding: 12px 30px;
    margin: 20px 0;
    line-height: 1.8;
  }

  .cover-footer {
    margin-bottom: 25px;
    font-size: 11pt;
    color: #334155;
    line-height: 1.7;
  }

  .badge {
    display: inline-block;
    background: #e0f2fe;
    color: #0369a1;
    font-weight: 700;
    font-size: 9pt;
    padding: 4px 12px;
    border-radius: 9999px;
    margin-bottom: 15px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  /* Typography */
  h1 {
    font-size: 17pt;
    font-weight: 700;
    color: #0f172a;
    border-bottom: 2px solid #2563eb;
    padding-bottom: 6px;
    margin-top: 36px;
    margin-bottom: 16px;
    page-break-after: avoid;
  }

  h2 {
    font-size: 13pt;
    font-weight: 700;
    color: #1e3a8a;
    margin-top: 26px;
    margin-bottom: 10px;
    page-break-after: avoid;
  }

  h3 {
    font-size: 11.5pt;
    font-weight: 600;
    color: #334155;
    margin-top: 18px;
    margin-bottom: 8px;
    page-break-after: avoid;
  }

  p {
    margin: 0 0 12px 0;
    text-align: justify;
  }

  ul, ol {
    margin: 0 0 14px 22px;
    padding: 0;
  }

  li {
    margin-bottom: 6px;
  }

  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 18px 0 24px 0;
    font-size: 9.5pt;
    page-break-inside: avoid;
  }

  th {
    background-color: #0f172a;
    color: #ffffff;
    font-weight: 600;
    text-align: left;
    padding: 9px 12px;
    border: 1px solid #0f172a;
  }

  td {
    padding: 8px 12px;
    border: 1px solid #cbd5e1;
    vertical-align: top;
  }

  tr:nth-child(even) {
    background-color: #f8fafc;
  }

  /* Code and Pre */
  pre {
    background-color: #0f172a;
    color: #e2e8f0;
    padding: 12px 16px;
    border-radius: 6px;
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 9pt;
    overflow-x: auto;
    line-height: 1.45;
    page-break-inside: avoid;
    margin: 14px 0 18px 0;
    border: 1px solid #1e293b;
  }

  code {
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 9.5pt;
    background-color: #f1f5f9;
    color: #0f172a;
    padding: 2px 5px;
    border-radius: 4px;
    border: 1px solid #e2e8f0;
  }

  pre code {
    background-color: transparent;
    color: inherit;
    padding: 0;
    border: none;
    font-size: inherit;
  }

  blockquote {
    border-left: 4px solid #2563eb;
    margin: 16px 0;
    padding: 8px 16px;
    background-color: #eff6ff;
    color: #1e3a8a;
    font-style: italic;
  }

  hr {
    border: none;
    border-top: 1px solid #e2e8f0;
    margin: 28px 0;
  }

  /* Print specific rules */
  @media print {
    body {
      background: #fff;
    }
    .cover-page {
      height: 98vh;
    }
    a {
      color: #0f172a;
      text-decoration: none;
    }
    h1 {
      page-break-before: always;
    }
    h1.first-title {
      page-break-before: avoid;
    }
  }
</style>
</head>
<body>

<!-- Academic Cover Page -->
<div class="cover-page">
  <div class="cover-header">
    <div class="badge">Final Year Project Specification & Architecture Report</div>
    <div class="cover-title">CAMPUS IT HELP DESK &amp; AUTOMATED LAB MONITOR</div>
    <div class="cover-subtitle">An Intelligent Dual-Tiered Diagnostic &amp; Automated IT Infrastructure Management Framework for Campus Computer Laboratories</div>
  </div>

  <div class="cover-meta">
    <strong>Degree:</strong> Bachelor of Engineering / Technology (Computer Science &amp; Engineering)<br>
    <strong>Domain:</strong> Distributed Network Systems, Automated Diagnostics &amp; Cloud Systems<br>
    <strong>Core Framework:</strong> React.js 19 &bull; Tailwind CSS &bull; Node.js &bull; Express.js &bull; MongoDB<br>
    <strong>Academic Year:</strong> 2025 &ndash; 2026
  </div>

  <div class="cover-footer">
    <p><strong>Department of Computer Science &amp; Engineering</strong><br>
    College of Engineering &amp; Technology<br>
    Comprehensive Project Documentation &amp; Technical Blueprint</p>
  </div>
</div>

<!-- Main Body Generated from Markdown -->
<div class="report-content">
{content}
</div>

</body>
</html>
"""

def generate_pdf():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    md_path = os.path.join(script_dir, "PROJECT_REPORT.md")
    html_path = os.path.join(script_dir, "PROJECT_REPORT.html")
    pdf_path = os.path.join(script_dir, "Campus_IT_Helpdesk_Project_Report.pdf")

    print(f"Reading markdown from: {md_path}")
    with open(md_path, "r", encoding="utf-8") as f:
        md_text = f.read()

    # Skip raw markdown title header if we already have the cover page
    # Strip first title block up to table of contents
    lines = md_text.split("\n")
    filtered_lines = []
    skip = False
    for line in lines:
        if line.startswith("# CAMPUS IT HELP DESK") or line.startswith("### *An Intelligent"):
            continue
        filtered_lines.append(line)
    
    clean_md = "\n".join(filtered_lines)

    print("Converting Markdown to HTML...")
    html_body = markdown.markdown(
        clean_md,
        extensions=["tables", "fenced_code", "nl2br"]
    )

    full_html = html_template.replace("{content}", html_body)

    with open(html_path, "w", encoding="utf-8") as f:
        f.write(full_html)
    print(f"HTML generated at: {html_path}")

    # Use Chrome or Edge headless to generate PDF
    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    browser_bin = chrome_path if os.path.exists(chrome_path) else edge_path

    print(f"Using browser for PDF printing: {browser_bin}")
    cmd = [
        browser_bin,
        "--headless=new",
        "--disable-gpu",
        "--no-pdf-header-footer",
        f"--print-to-pdf={pdf_path}",
        html_path
    ]

    print("Executing PDF generation...")
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode == 0 and os.path.exists(pdf_path):
        size_kb = os.path.getsize(pdf_path) / 1024
        print(f"SUCCESS: PDF created at: {pdf_path} ({size_kb:.1f} KB)")
    else:
        print(f"Error during PDF generation: {res.stderr}")

if __name__ == "__main__":
    generate_pdf()
