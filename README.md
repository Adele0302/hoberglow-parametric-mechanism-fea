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

**Deployment status:** The original HoberGlow HTML and animation engine are deployed, now with a touch-friendly iPad interface and a visible **“仅供非商业研究与作品集展示 · 禁止商业用途 / Non-commercial use only”** notice. The page now automatically looks for TWO optimized original-model files, `hoberglow/model.part-00.bin` and `hoberglow/model.part-01.bin`. **As long as these two large model assets have not yet been committed, the public page continues to offer local selection of `model-data.js` as a fallback, rather than falsely claiming the 3D has loaded.** The files together comprise 29,505,017 bytes and retain the original mesh hierarchy and vertex positions. The project owner confirmed public non-commercial portfolio display authorization; that permission does not authorize third-party commercial reuse.

A separate complete web-package ZIP contains the ready-to-deploy tablet-responsive site, original motion runtime, five project renders and the two optimized model binary parts, each smaller than GitHub's browser-upload size limit. The public app runtime itself does not grant permission for commercial redistribution of the model.

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
> the sponsoring company and are not included in this repository.**

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
- `hoberglow/app.js` — the unmodified bundled Three.js original transformation runtime; proprietary model data is **not** included.
- `index.html` — the original page interface with a local-only private model picker.
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
