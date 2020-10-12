import csv
import json
import re


CF_EXPORT_FILE=''
OUTPUT_FILE='entries_with_html.csv'


def main():
    html_entries = []
    file_json = read_cf_export_file(CF_EXPORT_FILE)
    entries = file_json['entries']
    for entry in entries:
        if not determine_if_includes_html(entry):
          continue
        html_entries.append({
          'id': entry['sys']['id'],
          'html': json.dumps(entry['fields'])
        })
    write_sheet(html_entries)


def read_cf_export_file(export_file):
    payload = None
    with open(export_file, 'r', encoding='utf-8', newline='') as raw_file:
        data = raw_file.read()
    payload = json.loads(data)
    return payload


def determine_if_includes_html(entry):
    has_html = False
    fields_data = json.dumps(entry['fields'])
    if re.search(r'<\S+', fields_data):
        has_html = True
    return has_html


def write_sheet(html_entries):
    with open(OUTPUT_FILE, 'w', newline='', encoding='utf8') as csvfile:
      writer = csv.DictWriter(csvfile, fieldnames=list(html_entries[0].keys()))
      writer.writeheader()
      for entry in html_entries:
          writer.writerow(entry)


if __name__ == '__main__':
  main()