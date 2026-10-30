"""Build the readable PRD from the original DOCX, including its embedded sheets."""
from html import escape
from io import BytesIO
from pathlib import Path, PurePosixPath
import re
import xml.etree.ElementTree as ET
from zipfile import ZipFile

ROOT = Path(__file__).resolve().parent
NS = {
    "w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    "o": "urn:schemas-microsoft-com:office:office",
    "x": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
}
W = "{" + NS["w"] + "}"
R = "{" + NS["r"] + "}"


def paragraph_text(node):
    return "".join(t.text or "" for t in node.findall(".//w:t", NS))


def inline(node):
    if node.tag == W + "t":
        return escape(node.text or "")
    if node.tag == W + "br":
        return "<br>"
    if node.tag == W + "tab":
        return " "
    value = "".join(inline(child) for child in node)
    if node.tag == W + "r":
        bold = node.find("w:rPr/w:b", NS)
        if bold is not None and bold.get(W + "val") not in ("0", "false"):
            value = "<strong>" + value + "</strong>"
    return value


def embedded_table(data, caption):
    with ZipFile(BytesIO(data)) as workbook:
        shared = []
        if "xl/sharedStrings.xml" in workbook.namelist():
            shared = ["".join(t.text or "" for t in s.findall(".//x:t", NS))
                      for s in ET.fromstring(workbook.read("xl/sharedStrings.xml"))]
        sheets = [n for n in workbook.namelist()
                  if re.fullmatch(r"xl/worksheets/sheet\d+\.xml", n)]
        assert len(sheets) == 1, "Review additional sheets before converting."
        rows = []
        for row in ET.fromstring(workbook.read(sheets[0])).findall("x:sheetData/x:row", NS):
            values = []
            for cell in row.findall("x:c", NS):
                column = re.match(r"[A-Z]+", cell.get("r")).group()
                index = 0
                for letter in column:
                    index = index * 26 + ord(letter) - ord("A") + 1
                while len(values) < index:
                    values.append("")
                value = cell.find("x:v", NS)
                text = value.text or "" if value is not None else "".join(
                    t.text or "" for t in cell.findall(".//x:t", NS))
                if cell.get("t") == "s":
                    text = shared[int(text)]
                values[index - 1] = text
            if any(values):
                rows.append(values)
    header = "".join('<th scope="col">' + escape(v) + "</th>" for v in rows[0])
    body = "".join("<tr>" + "".join("<td>" + escape(v) + "</td>" for v in row) + "</tr>"
                   for row in rows[1:])
    return ('<div class="prd-table-wrap" tabindex="0" role="region" aria-label="' + caption
            + '"><table class="prd-table"><caption>' + caption + "</caption><thead><tr>"
            + header + "</tr></thead><tbody>" + body + "</tbody></table></div>")


with ZipFile(ROOT / "assets/自行车prd.docx") as document:
    body = ET.fromstring(document.read("word/document.xml")).find("w:body", NS)
    relationships = {r.get("Id"): r.get("Target")
                     for r in ET.fromstring(document.read("word/_rels/document.xml.rels"))}
    numbering = ET.fromstring(document.read("word/numbering.xml"))
    definitions = {}
    for item in numbering.findall("w:abstractNum", NS):
        level = item.find("w:lvl", NS)
        start = level.find("w:start", NS)
        definitions[item.get(W + "abstractNumId")] = (
            "ol" if level.find("w:numFmt", NS).get(W + "val") == "decimal" else "ul",
            int(start.get(W + "val")) if start is not None else 1)
    lists = {item.get(W + "numId"): definitions[item.find("w:abstractNumId", NS).get(W + "val")]
             for item in numbering.findall("w:num", NS)}
    fragments, outline = [], []
    list_kind, next_number, title_seen, part = None, 1, False, 0
    table_count = 0

    def close_list():
        global list_kind
        if list_kind:
            fragments.append("</" + list_kind + ">")
            list_kind = None

    for node in body:
        if node.tag == W + "tbl":
            close_list()
            fragments.append('<aside class="prd-note">' + "".join(
                "<p>" + inline(p) + "</p>" for p in node.findall(".//w:p", NS)
                if paragraph_text(p)) + "</aside>")
            continue
        if node.tag != W + "p":
            continue
        object_node = node.find(".//o:OLEObject", NS)
        if object_node is not None:
            close_list()
            table_count += 1
            name = str(PurePosixPath("word") / relationships[object_node.get(R + "id")])
            caption = ["目标用户与项目假设", "优先级规则", "自行车功能结构"][table_count - 1]
            fragments.append(embedded_table(document.read(name), caption))
            continue
        text = paragraph_text(node)
        if not text.strip():
            continue
        if text == "点击图片可查看完整电子表格":
            continue  # The complete embedded spreadsheet is now an actual HTML table.
        style = node.find("w:pPr/w:pStyle", NS)
        number = node.find("w:pPr/w:numPr/w:numId", NS)
        value = inline(node)
        if style is not None:
            close_list()
            source_level = int(style.get(W + "val"))
            if not title_seen:
                fragments.append('<h1 class="prd-title" id="document-start" tabindex="-1">' + value + "</h1>")
                title_seen = True
                continue
            level = source_level + 1
            if level == 2:
                part += 1
                anchor = "part-" + str(part)
            elif text.startswith("F"):
                anchor = "function-" + text.split(".", 1)[0].lower()
            else:
                anchor = "section-" + str(len(outline) + 1)
            fragments.append(f'<h{level} id="{anchor}" tabindex="-1">{value}</h{level}>')
            if level in (2, 3):
                outline.append((anchor, text, level))
        elif number is not None:
            kind, start = lists[number.get(W + "val")]
            if list_kind != kind or (kind == "ol" and start != next_number):
                close_list()
                fragments.append("<" + kind + (f' start="{start}"' if kind == "ol" and start != 1 else "") + ">")
                list_kind = kind
            fragments.append("<li>" + value + "</li>")
            next_number = start + 1
        else:
            close_list()
            classname = "prd-metadata" if text.startswith("项目编号：") else "prd-source-name" if not title_seen else ""
            fragments.append((f'<p class="{classname}">' if classname else "<p>") + value + "</p>")
    close_list()
    assert table_count == 3
    assert len([entry for entry in outline if entry[0].startswith("function-")]) == 14

options = '\n'.join('<option value="' + anchor + '">' + ("　" if level == 3 else "")
                    + escape(text) + "</option>" for anchor, text, level in outline)
html = '''<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>自行车 PRD · 城市通勤自行车产品需求文档</title>
<script>if(new URLSearchParams(location.search).get('embed')==='1')document.documentElement.classList.add('prd-embedded');</script>
<link rel="stylesheet" href="tokens.css?v=reference-2">
<link rel="stylesheet" href="system.css?v=reference-2">
<link rel="stylesheet" href="product-lesson.css?v=product-reader-1">
</head>
<body class="prd-page">
<a class="skip" href="#prd-content">跳到文档正文</a>
<header class="prd-header"><a href="课程内容页.html#product-topic-3">← 返回课程</a><span>项目拆解 · 教学示例</span></header>
<nav class="prd-reader-nav" aria-label="文档章节">
<label for="prd-jump">文档目录</label><select id="prd-jump"><option value="document-start">从头阅读</option>
''' + options + '''
</select></nav>
<main class="prd-main" id="prd-content" tabindex="-1"><article class="rich prd-document">
''' + '\n'.join(fragments) + '''
</article><footer class="prd-footer"><a href="#document-start">回到文档开头 ↑</a></footer></main>
<script>
document.getElementById('prd-jump').addEventListener('change',event=>{
  const target=document.getElementById(event.target.value);
  if(target){
    history.replaceState(null,'','#'+target.id);
    const inset=document.querySelector('.prd-reader-nav').offsetHeight+16;
    window.scrollTo({top:target.getBoundingClientRect().top+scrollY-inset,behavior:'instant'});
    target.focus({preventScroll:true});
  }
});
</script>
</body></html>
'''
(ROOT / "bicycle-prd.html").write_text(html, encoding="utf-8")
print("Built bicycle-prd.html: full document, 14 functions, 3 complete embedded tables.")
