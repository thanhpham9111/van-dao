# BATCH 08 — Ground tiles

## Delivery

- Completed all 20 terrain tiles: `gp_c0_r0` through `gp_c4_r3`.
- Each tile is a 1536 × 1024 PNG in `assets/map/`.
- `gp_c2_r1` was created first as the color and brushwork standard. Subsequent tiles were generated with their guide, the standard tile, and an adjacent tile as references.
- The intended ground layout follows the corresponding `huong_dan/guide_gp_c*_r*.jpg`: paths, paved zones, river, pond and banks are kept in their indicated areas. Guide overlays and labels are not included in the artwork.
- Artwork contains ground surfaces only: grass, dirt, stone, water, low flowers, pebbles and ground texture. No houses, trees, people or raised props are included. The dark edge areas in columns 0 and 4 are filled with terrain, respecting the request to omit trees.

## Integration notes

- No intentional relocation of a guide feature was made. Since the tiles are hand-painted image generations, exact pixel alignment within the guide's ±20 px tolerance and seam continuity should be checked in the game using its overlap/fade logic before final integration.
- The brief states a 4800 × 3200 world split into 5 × 4 tiles, and also specifies a 1200 × 800 core per tile. Five 1200 px cores imply a 6000 px world width, so please verify the intended horizontal core width or world width in the map loader.
