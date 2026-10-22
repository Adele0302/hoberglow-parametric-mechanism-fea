# HoberGlow — Parametric Kinetic Mechanism, Optics and FEA

![HoberGlow motion study](assets/motion-range.png)

HoberGlow is a Rhino/Grasshopper research prototype for a transformable kinetic
lighting system. This repository demonstrates three connected workflows:

- a scissor-based dynamic mechanism;
- a lightweight optical preview and report;
- a Karamba3D 1/8 cyclic-sector structural proxy with five active elements.

## Interactive web study

**[View the standalone webpage source](./index.html)** · [Public site address (after GitHub Pages is enabled)](https://adele0302.github.io/hoberglow-parametric-mechanism-fea/)

A separate, self-contained HTML experience has been added to this repository. It illustrates the eight-sector scissor-linkage concept with a **pull-cord gesture**, **manual contraction slider**, and **play/pause animation**. It requires no Rhino or Grasshopper installation. To publish it as a public URL, enable GitHub Pages for the `main` branch / root directory in repository Settings → Pages.

**Scope and accuracy:** The browser illustration is a simplified, independently drawn motion *schematic*. It is not derived from the proprietary CAD mesh and is not a simulation of the exact product, photometry or structural performance. The **full original 3D viewer is intentionally distributed as a private local-only package** rather than committed to this public repository.

### Visual research narrative

The project is organized around four linked questions: **what changes** (deployment states), **how it moves** (radial scissor-linkage mechanism), **what the movement does to light** (hypothesized layering and occlusion), and **how it can be evaluated** (parametric Grasshopper and a reduced structural proxy).

| Motion and states | Mechanism geometry |
|:--:|:--:|
| ![Motion study](assets/motion-range.png) | ![Mechanism skeleton](assets/mechanism-skeleton.png) |
| Conceptual open/closed configurations | Articulated members and their constrained connections |

| Parametric definition | Section properties |
|:--:|:--:|
| ![Grasshopper workflow](assets/grasshopper-public-workflow.png) | ![Section workflow](assets/section-property-workflow.png) |
| Input-driven transformations | Lightweight structural study |

### Editorial image gallery

Five user-provided project renders have been added as **optimized, small-resolution WebP previews** to make the research narrative easier to scan. The full-resolution files remain outside this public repository; these previews are **portfolio documentation**, not licensed CAD source or an offer to reproduce the original company-owned appearance.

| Overall concept | Three-stage motion |
|:--:|:--:|
| ![Suspended HoberGlow concept](assets/editorial/overview.webp) | ![Shrink through spread](assets/editorial/motion-states.webp) |
| Suspended kinetic lighting concept | Shrink → intermediate → spread |

| Light sculpture | Mechanism detail |
|:--:|:--:|
| ![Layered kinetic light sculpture](assets/editorial/sculptural-light.webp) | ![Scissor-linkage closeup](assets/editorial/linkage-detail.webp) |
| Spatial composition and repeated canopies | Articulated scissor members and pin connections |

![Canopy and linkage showing optical modulation](assets/editorial/optical-modulation.webp)

*Layered canopy / optical modulation study.* The relation between geometry and light is illustrated, not asserted as quantitatively measured or photometrically validated.

For a larger editorial layout and hands-on illustration, use the [standalone interactive webpage](./index.html) in a browser or enable GitHub Pages in Settings → Pages.

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
- `assets/` — documentation screenshots only; these are not downloadable CAD
  assets and cannot be reconstructed into the production model.
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
