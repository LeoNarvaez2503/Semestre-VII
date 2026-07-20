import os
import subprocess
import re

def markdown_to_html(md_text):
    # Basic markdown to HTML converter for report layout
    html = md_text
    # Escape HTML special chars except inside format
    # Headers
    html = re.sub(r'^# (.*?)$', r'<h1>\1</h1>', html, flags=re.MULTILINE)
    html = re.sub(r'^## (.*?)$', r'<h2>\1</h2>', html, flags=re.MULTILINE)
    html = re.sub(r'^### (.*?)$', r'<h3>\1</h3>', html, flags=re.MULTILINE)
    html = re.sub(r'^#### (.*?)$', r'<h4>\1</h4>', html, flags=re.MULTILINE)
    
    # Bold & Italic
    html = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', html)
    html = re.sub(r'\*(.*?)\*', r'<em>\1</em>', html)
    html = re.sub(r'`(.*?)`', r'<code>\1</code>', html)
    
    # Tables conversion
    def convert_table(match):
        rows = match.group(0).strip().split('\n')
        table_html = ['<table>']
        is_header = True
        for row in rows:
            if '---|' in row or '|---' in row:
                is_header = False
                continue
            cols = [c.strip() for c in row.split('|')[1:-1]]
            tag = 'th' if is_header else 'td'
            row_html = '  <tr>' + ''.join(f'<{tag}>{c}</{tag}>' for c in cols) + '</tr>'
            table_html.append(row_html)
        table_html.append('</table>')
        return '\n'.join(table_html)
    
    html = re.sub(r'(\|.*\|\n\|[-:| ]+\|\n(?:\|.*\|\n?)+)', convert_table, html)
    
    # Lists
    html = re.sub(r'^\s*-\s+(.*?)$', r'<li>\1</li>', html, flags=re.MULTILINE)
    html = re.sub(r'(<li>.*?</li>\n?)+', r'<ul>\g<0></ul>', html, flags=re.DOTALL)
    
    # Paragraphs
    paragraphs = html.split('\n\n')
    formatted_p = []
    for p in paragraphs:
        p = p.strip()
        if not p.startswith('<h') and not p.startswith('<table') and not p.startswith('<ul') and not p.startswith('<ol'):
            formatted_p.append(f'<p>{p}</p>')
        else:
            formatted_p.append(p)
            
    content_html = '\n'.join(formatted_p)
    
    styled_document = f"""<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Plan SQAP - KairosMix Final</title>
    <style>
        body {{
            font-family: 'Segoe UI', Arial, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            max-width: 900px;
            margin: 0 auto;
            padding: 40px;
        }}
        h1 {{
            color: #0d47a1;
            border-bottom: 3px solid #0d47a1;
            padding-bottom: 10px;
            font-size: 24pt;
        }}
        h2 {{
            color: #1565c0;
            border-bottom: 1px solid #bbdefb;
            padding-bottom: 5px;
            margin-top: 30px;
            font-size: 18pt;
        }}
        h3 {{
            color: #1e88e5;
            margin-top: 20px;
            font-size: 14pt;
        }}
        table {{
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 10pt;
        }}
        th, td {{
            border: 1px solid #cfd8dc;
            padding: 10px;
            text-align: left;
        }}
        th {{
            background-color: #e3f2fd;
            color: #0d47a1;
            font-weight: bold;
        }}
        tr:nth-child(even) {{
            background-color: #f8f9fa;
        }}
        code {{
            background-color: #f1f3f5;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Consolas', monospace;
            font-size: 9.5pt;
        }}
        ul {{
            margin-left: 20px;
        }}
        li {{
            margin-bottom: 6px;
        }}
        @page {{
            size: A4;
            margin: 20mm;
        }}
    </style>
</head>
<body>
    {content_html}
</body>
</html>"""
    return styled_document

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    md_path = os.path.join(base_dir, "GRUPO#_PROYECTOFINAL_PARCIAL3.md")
    html_path = os.path.join(base_dir, "GRUPO#_PROYECTOFINAL_PARCIAL3.html")
    pdf_path = os.path.join(base_dir, "GRUPO#_PROYECTOFINAL_PARCIAL3.pdf")
    root_pdf_path = os.path.abspath(os.path.join(base_dir, "..", "GRUPO#_PROYECTOFINAL_PARCIAL3.pdf"))
    
    if os.path.exists(md_path):
        with open(md_path, "r", encoding="utf-8") as f:
            md_text = f.read()
        
        html_content = markdown_to_html(md_text)
        with open(html_path, "w", encoding="utf-8") as f:
            f.write(html_content)
            
        edge_cmd = [
            r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
            "--headless",
            "--disable-gpu",
            f"--print-to-pdf={pdf_path}",
            html_path
        ]
        
        res = subprocess.run(edge_cmd, capture_output=True, text=True)
        print("PDF generated at:", pdf_path)
        
        # Also copy PDF to root of KairosMixConBack
        with open(pdf_path, "rb") as f_in, open(root_pdf_path, "wb") as f_out:
            f_out.write(f_in.read())
        print("PDF copied to root at:", root_pdf_path)

if __name__ == "__main__":
    main()
