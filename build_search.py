import json
import pprint
import yaml
from os import listdir
from os.path import isfile, join

pp = pprint.PrettyPrinter(indent=4)

path = '_posts/'

metadata = {}

files = [ '{path}{file}'.format(path=path, file=f) for f in listdir(path) if isfile(join(path, f)) ]

for file in files:
  with open(file) as input_data:
    started = False
    completed = False
    lines = ''

    # Skips text before the beginning of the interesting block:
    for line in input_data:

      if line.strip() == '---':
        if not started:
          started = True
          continue
        else:
          completed = True
          break

      lines += line
  yaml_data = yaml.load(lines)
  metadata[yaml_data['permalink']] = yaml_data

# metadata contains all post metadata keyed by permalink
f = open('_site/metadata.json', 'w')
f.write(json.dumps(metadata))
f.close()

tags = {}
for link, data in metadata.iteritems():
  for tag in data['tags']:
    if tag not in tags:
      tags[tag] = []

    tags[tag].append(metadata[link])

# tags contains all tags and post metadata
f = open('_site/tags.json', 'w')
f.write(json.dumps(tags))
f.close()

categories = {}
for link, data in metadata.iteritems():
  for category in data['categories']:
    if category not in categories:
      categories[category] = []

    categories[category].append(metadata[link])

# categories contains posts by category
f = open('_site/categories.json', 'w')
f.write(json.dumps(categories))
f.close()

users = {}
for link, data in metadata.iteritems():
  if data['author'] not in users:
    users[data['author']] = []

  users[data['author']].append(metadata[link])

# users is post by users
f = open('_site/users.json', 'w')
f.write(json.dumps(users))
f.close()