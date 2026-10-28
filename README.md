# HoberGlow — Parametric Kinetic Mechanism, Optics and FEA

![HoberGlow motion study](assets/motion-range.png)

HoberGlow is a Rhino/Grasshopper research prototype for a transformable kinetic
lighting system. This repository demonstrates three connected workflows:

- a scissor-based dynamic mechanism;
- a lightweight optical preview and report;
- a Karamba3D 1/8 cyclic-sector structural proxy with five active elements.

## HoberGlow — original interactive web viewer

**[Open the HoberGlow webpage](https://adele0302.github.io/hoberglow-parametric-mechanism-fea/)** · **[Inspect the original viewer runtime](hoberglow/app.js)**

This page now uses the **actual HoberGlow HTML interface and the unchanged bundled motion application from `Research-Motion-Studio.zip`**. The earlier hand-drawn SVG approximation has been removed.

The source application retains:
- the original model meshes and their individual transformation bindings once the geometry is loaded;
- calibrated radial scissor-linkage motion, petal closure and associated cable updates;
- interactive OrbitControls camera, **Play / Pause**, **Open ↔ Closed** slider and **Record** interface.

**Deployment status:** The original HoberGlow HTML and animation engine are deployed, now with a touch-friendly iPad interface and a visible **“仅供非商业研究与作品集展示 · 禁止商业用途 / Non-commercial use only”** notice. The public page automatically looks for THREE losslessly split original-model files: `hoberglow/model.part-00.bin`, `hoberglow/model.part-01.bin`, and `hoberglow/model.part-02.bin` (18,899,124; 18,899,124; and 18,899,125 bytes). **All three model files are now present on `main` and included in the published GitHub Pages artifact.** The page loads them automatically, with public GitHub raw and jsDelivr fallback mirrors if an individual Pages download fails; visitors are never asked to upload local model files. All three files recombine into the original 56,697,373-byte gzip-wrapped GLB, preserving the exact mesh geometry and object hierarchy. The project owner confirmed public non-commercial portfolio display authorization; that permission does not authorize third-party commercial reuse.

A separate original-model release ZIP contains the three unmodified gzip data parts, each smaller than GitHub's browser-upload size limit. All three files are already published in `hoberglow/` on the default `main` branch. The existing HTML and bundled animation engine provide interactive Play/Pause, Open/Closed and touch controls without a visitor login. The online WebGL rendering still requires browser-side verification. The public app runtime itself does not grant permission for commercial redistribution of the model.

### Visual research narrative — actual project images

| Concept overview | Three original motion states |
|:--:|:--:|
| ![HoberGlow concept render](assets/editorial/overview.webp) | ![HoberGlow shrink and spread states](assets/editorial/motion-states.webp) |
| Kinetic suspended lighting sculpture | Shrink → intermediate → spread |

| Suspended canopies | Scissor-linkage detail |
|:--:|:--:|
| ![Suspended HoberGlow render](assets/editorial/sculptural-light.webp) | ![Actual HoberGlow articulated linkage](assets/editorial/linkage-detail.webp) |
| Layered luminaires and composition | Original articulated frame and pin joints |

![HoberGlow canopy and light modulation](assets/editorial/optical-modulation.webp)

*Optical modulation illustration.* These renders are visual documentation, not published CAD source or calibrated photometric measurements. The motion solver is geometry-calibrated; it is not collision or load simulation.

## Important intellectual-property notice

> **The original product appearance and production 3D model were purchased by
> the sponsoring company. The repository owner has confirmed authorization
> for public portfolio display and distribution of the HoberGlow model; this
> does not grant third parties commercial-use or reuse rights.**

The public Grasshopper definition contains the independently developed
parametric workflow, named input interfaces, motion logic, optical analysis and
reduced structural-analysis chain. All referenced product geometry has been
removed from the public file.

You are welcome to study the workflow and bind **your own skeleton or product
geometry** to the named Grasshopper inputs. This repository does not grant any
rights to the company's proprietary product design or production model.

## What is included

- `grasshopper/HoberGlow_Public_Framework.ghx` — English-labelled public
  definition with proprietary geometry references cleared.
- `hoberglow/app.js` — original bundled Three.js transformation runtime with support for directly loading the original compressed model data.
- `index.html` — tablet-responsive original interactive viewer; automatically loads the public three-part model when files are present, with a local-only model picker as a backup.
- `assets/` — public research screenshots and five optimized editorial renders, **not** production CAD.
- `LICENSE.md` — limited permission for the author-owned framework and an
  explicit exclusion for company-owned assets.

The original binary `.gh` file is intentionally not published because it cannot
be independently audited and sanitized here as reliably as the text-based
`.ghx` archive.

## Bind your own geometry

Open the GHX in Rhino 8 / Grasshopper, then set the following named inputs from
your own Rhino document:

| Input group | Required named inputs |
|---|---|
| Mechanism members | `A PARTS INPUT`, `B PARTS INPUT` |
| Motion axes | `CENTER AXIS INPUT`, `A AXIS 1 INPUT`, `A AXIS 2 INPUT`, `B AXIS 1 INPUT`, `B AXIS 2 INPUT` |
| Upper assembly | `UPPER PETAL INPUT`, `UPPER RING INPUT`, `UPPER GUIDE INPUT` |
| Lower assembly | `LOWER PETAL INPUT`, `LOWER RING INPUT`, `LOWER GUIDE INPUT` |
| Optical geometry | `LIGHT GEOMETRY 1`, `LIGHT GEOMETRY 2`, `LIGHT GEOMETRY 3` |

After binding the geometry, adjust:

- `MECHANISM ANGLE THETA [deg]`
- `UPPER TRAVEL`
- `LOWER TRAVEL`
- `TOTAL RING LOAD [kN]`

![Public Grasshopper workflow](assets/grasshopper-public-workflow.png)

## Read the outputs

### Dynamic mechanism

- `Assembly` — live transformed geometry in the Rhino viewport.
- `DYNAMIC MECHANISM REPORT` — axis, datum and transformation diagnostics.

### Optical analysis

- `OpticalPreview` — live rays/cones in the Rhino viewport.
- `OPTICAL ANALYSIS REPORT` — current optical-state summary.

### Structural proxy

- `Maximum Displacement [cm]`
- `Maximum Resultant Force [kN]`
- `Sum of Reaction Forces [kN]`
- `Elastic Energy Change [kNm]`
- member maxima: `N`, `Vy`, `Vz`, `Mt`, `My`, `Mz`

![Mechanism skeleton preview](assets/mechanism-skeleton.png)

## Dependencies

- Rhino 8
- Grasshopper
- Karamba3D
- Rhino 8 Python 3 Script component

If Karamba3D displays translated port captions, choose:

`Karamba3D menu → Set Language for Components → English`

Then recompute or reopen the definition.

## Structural-analysis limitation

The public structural branch is a **five-element reduced-order proxy** designed
to remain below Karamba3D's 20-beam trial limit. It represents one eighth of the
eight-sector mechanism and assumes cyclic symmetry. It is suitable for workflow
demonstration and relative comparisons, not final structural certification.

![Section-property workflow](assets/section-property-workflow.png)

## Authorship and project context

HoberGlow began as an industry-sponsored team design project. The
Grasshopper-based kinematics, optical-analysis workflow and reduced Karamba3D
study presented here were developed later as an independent computational
design investigation by Shuofei Zan.

The project was submitted to the Red Dot Award; it did not receive an award.
