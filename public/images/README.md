# Image slots

Every image on the site is a placeholder until a file with the exact name below exists.
Drop the file in and it appears automatically (no code changes). In `next dev`, each placeholder
shows the path it expects. After adding images, restart the dev server / rebuild for production.

Recommended: JPG, ~1600px on the long edge, under 300 KB.

## Site (`public/images/hero/`) — paths set in `src/config/site.ts`

| File | Where | Ratio |
|---|---|---|
| hero.jpg | Landing hero background | 16:9 or wider |
| gym-floor.jpg | Landing "About the gym" | 4:3 |
| classes.jpg | /classes banner | wide |
| trainers.jpg | /trainers banner | wide |
| pricing.jpg | /pricing banner | wide |
| reception.jpg | /contact banner | wide |
| map.jpg | /contact map (or replace with a Maps embed) | 16:9 |
| login.jpg | /login side panel | portrait |
| join.jpg | /register side panel | portrait |

## Classes (`public/images/classes/`) — 16:9, paths set in `src/mocks/data.ts`

strength-foundations.jpg, hiit-burn.jpg, power-yoga.jpg, spin-ride.jpg,
zumba-party.jpg, crossfit-wod.jpg, core-pilates.jpg, boxfit.jpg

## Trainers (`public/images/trainers/`) — 4:3 portraits, paths set in `src/mocks/data.ts`

arjun-mehta.jpg, priya-nair.jpg, kavya-rao.jpg, rohan-das.jpg, sneha-kulkarni.jpg
