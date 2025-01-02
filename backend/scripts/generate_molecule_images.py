import sys
import os
from rdkit import Chem
from rdkit.Chem import Draw

def main():
    if len(sys.argv) < 3:
        print("Usage: python generate_molecule_images.py <output_dir> <SMILES1> <SMILES2> ...")
        sys.exit(1)

    output_dir = sys.argv[1]
    smiles_list = sys.argv[2:]
    
    os.makedirs(output_dir, exist_ok=True)

    for i, smiles in enumerate(smiles_list, start=1):
        mol = Chem.MolFromSmiles(smiles)
        if mol:
            print(f"Structure {i}: {smiles}")
            img = Draw.MolToImage(mol)
            img.save(os.path.join(output_dir, f"structure_{i}.png"))
        else:
            print(f"Structure {i}: {smiles} - Invalid SMILES")

if __name__ == "__main__":
    main()
