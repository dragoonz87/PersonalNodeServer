import os, glob, re
from shutil import copy, copytree, rmtree

force_update = False

spa_base_path = "/home/drag/Documents/PrivateSPAs"
cdn_base_path = "./servers/cdn/files/spas"
hashes_path = "./scripts/current_hashes.txt"

def get_build_hash(filepath: str, file_end=None):
  if file_end == None:
    file_end = "js"
  pattern = re.compile(f"main.([0-z]+).{file_end}")
  hash = pattern.search(filepath).group(1)
  return hash


def get_prev_hashes():
  hashes = {}

  with open(hashes_path) as file:
    for line in file.readlines():
      equals = line.index('=')
      folder = line[:equals]
      hash = line[equals+1:].replace("\n", "")
      hashes[folder] = hash
  
  return hashes


def run():
  hashes = {}
  skipped_hashes = []

  for folder in os.listdir(spa_base_path):
    copy_file = False
    (spa_path,) = os.listdir(f"{spa_base_path}/{folder}")
    spa_build_path = f"{spa_base_path}/{folder}/{spa_path}/build"
    spa_build_hash = get_build_hash(glob.glob(f"{spa_build_path}/static/js/main.*.js")[0])
    spa_build_css_hash = get_build_hash(glob.glob(f"{spa_build_path}/static/css/main.*.css")[0], "css")
    hashes[folder] = spa_build_hash
    if hashes[folder] != get_prev_hashes().setdefault(folder, None):
      copy_file = True
    else:
      skipped_hashes.append(spa_build_hash)
    if copy_file:
      cdn_spa_build_path = f"{cdn_base_path}/{folder.lower()}"
      try:
        if os.path.exists(cdn_spa_build_path):
          rmtree(cdn_spa_build_path)
        copytree(spa_build_path, cdn_spa_build_path)
        copy(f'{cdn_spa_build_path}/static/js/main.{spa_build_hash}.js', f'{cdn_spa_build_path}/static/js/main.js')
        copy(f'{cdn_spa_build_path}/static/css/main.{spa_build_css_hash}.css', f'{cdn_spa_build_path}/static/css/main.css')
      except (FileNotFoundError):
        print(f"{folder} not found")
      except (FileExistsError):
        print(f"{folder} exists")
    else:
      print(f'Ignoring {folder}...')

  if len(skipped_hashes) != len(hashes.values()):
    print("Finished copying")
  
    with open(hashes_path, 'r+') as file:
      file.truncate(0)
      for folder, hash in hashes.items():
        file.write(f'{folder}={hash}\n')
    print("Updated hashes")
  else:
    print("Nothing to update")


if __name__ == "__main__":
  if force_update:
    with open(hashes_path, 'r+') as file:
      file.truncate(0)
  run()
