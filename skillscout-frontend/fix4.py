content = open('pages/admin/revenue.tsx', 'r').read()

# Remove the data section (from "// --- Data" to just before "// --- Page")
data_section_start = content.find('\n\n// \u2500\u2500\u2500 Data \u2500')
page_section_start = content.find('\n\n// \u2500\u2500\u2500 Page \u2500')

print(f"Data section: {data_section_start} to {page_section_start}")
print(repr(content[data_section_start:data_section_start+30]))
print(repr(content[page_section_start:page_section_start+30]))

# Remove data section
cleaned = content[:data_section_start] + content[page_section_start:]
open('pages/admin/revenue.tsx', 'w').write(cleaned)
print("Done!", cleaned.count('\n'), "lines")
