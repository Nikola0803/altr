/**
 * Certificate of Analysis data — sourced from the client's WooCommerce lab
 * results page and matched to this catalog's product slugs. PDFs live in
 * public/coa/. Shaped to mirror the ALTR CMS plugin's `altr_coa` CPT
 * (see altr-cms-plugin/includes/meta-boxes-coa.php) so this becomes a thin
 * fetch from `/altr/v1/coas` once the plugin is connected, instead of a
 * rewrite.
 */

export interface CoaLab {
  labName: string;
  scope: string;
  purity: string;
  testedLabel: string;
  batch: string;
  pdfUrl: string;
}

export interface ProductCoa {
  slug: string;
  displayName: string;
  composition: string;
  topPurity: string;
  topMethod: string;
  verifiedByTwoLabs: boolean;
  labs: CoaLab[];
}

export const productCoas: ProductCoa[] = [
  {
    slug: "bpc-157-10mg",
    displayName: "BPC-157",
    composition: "Pentadecapeptide",
    topPurity: "100.00%",
    topMethod: "HPLC-UV",
    verifiedByTwoLabs: false,
    labs: [
      {
        labName: "PPB Analytical Inc., Toronto",
        scope: "Heavy Metals + Purity",
        purity: "100.00%",
        testedLabel: "Mar 2026",
        batch: "5026_0269",
        pdfUrl: "/coa/Certificate-of-Analysis-5026_0269-2026030630-02.pdf",
      },
    ],
  },
  {
    slug: "cjc-1295-without-dac-ipamorelin-10mg",
    displayName: "CJC-1295 + Ipamorelin",
    composition: "CJC-1295 · Ipamorelin",
    topPurity: "100.00%",
    topMethod: "HPLC-UV",
    verifiedByTwoLabs: true,
    labs: [
      {
        labName: "PPB Analytical Inc., Toronto",
        scope: "Heavy Metals + Purity",
        purity: "100.00%",
        testedLabel: "Mar 2026",
        batch: "5026_0249",
        pdfUrl: "/coa/Certificate-of-Analysis-5026_0249-2026030612-02.pdf",
      },
      {
        labName: "Testides",
        scope: "Endotoxins + Purity",
        purity: "99.57%",
        testedLabel: "Apr 2026",
        batch: "040626-01",
        pdfUrl: "/coa/BW-CJCI-10-040626-01.pdf",
      },
    ],
  },
  {
    slug: "dsip-5mg",
    displayName: "DSIP",
    composition: "Nonapeptide",
    topPurity: "100.00%",
    topMethod: "HPLC-UV",
    verifiedByTwoLabs: false,
    labs: [
      {
        labName: "PPB Analytical Inc., Toronto",
        scope: "Heavy Metals + Purity",
        purity: "100.00%",
        testedLabel: "Mar 2026",
        batch: "5026_0251",
        pdfUrl: "/coa/Certificate-of-Analysis-5026_0251-2026030614-02.pdf",
      },
    ],
  },
  {
    slug: "ghk-cu-50mg",
    displayName: "GHK-Cu",
    composition: "Copper-binding tripeptide",
    topPurity: "100.00%",
    topMethod: "HPLC-UV",
    verifiedByTwoLabs: true,
    labs: [
      {
        labName: "PPB Analytical Inc., Toronto",
        scope: "Heavy Metals + Purity",
        purity: "100.00%",
        testedLabel: "Mar 2026",
        batch: "5026_0261",
        pdfUrl: "/coa/Certificate-of-Analysis-5026_0261-2026030622-02.pdf",
      },
      {
        labName: "Testides",
        scope: "Endotoxins + Purity",
        purity: "99.84%",
        testedLabel: "Apr 2026",
        batch: "040626-01",
        pdfUrl: "/coa/BW-GHKC-100-040626-01.pdf",
      },
    ],
  },
  {
    slug: "igf-1-lr3-1mg",
    displayName: "IGF-1 LR3",
    composition: "Insulin-like growth factor analog",
    topPurity: "100.00%",
    topMethod: "HPLC-UV",
    verifiedByTwoLabs: true,
    labs: [
      {
        labName: "PPB Analytical Inc., Toronto",
        scope: "Heavy Metals + Purity",
        purity: "100.00%",
        testedLabel: "Mar 2026",
        batch: "5026_0263",
        pdfUrl: "/coa/Certificate-of-Analysis-5026_0263-2026030624-02.pdf",
      },
      {
        labName: "Testides",
        scope: "Endotoxins + Purity",
        purity: "96.87%",
        testedLabel: "May 2026",
        batch: "VTL-IGF01102",
        pdfUrl: "/coa/BW-ILGF3-1mg-050926-01.pdf",
      },
    ],
  },
  {
    slug: "nad-plus-500mg",
    displayName: "NAD+",
    composition: "Nicotinamide adenine dinucleotide",
    topPurity: "100.00%",
    topMethod: "HPLC-UV",
    verifiedByTwoLabs: true,
    labs: [
      {
        labName: "PPB Analytical Inc., Toronto",
        scope: "Heavy Metals + Purity",
        purity: "100.00%",
        testedLabel: "Mar 2026",
        batch: "5026_0247",
        pdfUrl: "/coa/Certificate-of-Analysis-5026_0247-2026030610-02.pdf",
      },
      {
        labName: "Testides",
        scope: "Endotoxins + Purity",
        purity: "97.33%",
        testedLabel: "May 2026",
        batch: "VTL-NAD500102",
        pdfUrl: "/coa/BW-NAD-500mg-050926-01.pdf",
      },
    ],
  },
  {
    slug: "retatrutide-10mg",
    displayName: "Retatrutide",
    composition: "Triple-agonist peptide",
    topPurity: "100.00%",
    topMethod: "HPLC-UV",
    verifiedByTwoLabs: true,
    labs: [
      {
        labName: "PPB Analytical Inc., Toronto",
        scope: "Heavy Metals + Purity",
        purity: "100.00%",
        testedLabel: "Apr 2026",
        batch: "5026_0271",
        pdfUrl: "/coa/Certificate-of-Analysis-5026_0271-2026030632-01.pdf",
      },
      {
        labName: "Testides",
        scope: "Endotoxins + Purity",
        purity: "99.43%",
        testedLabel: "Apr 2026",
        batch: "040626-01",
        pdfUrl: "/coa/BW-RETA-10-040626-01.pdf",
      },
    ],
  },
  {
    slug: "tb-500-5mg",
    displayName: "TB-500",
    composition: "Thymosin β4 fragment",
    topPurity: "100.00%",
    topMethod: "HPLC-UV",
    verifiedByTwoLabs: true,
    labs: [
      {
        labName: "PPB Analytical Inc., Toronto",
        scope: "Heavy Metals + Purity",
        purity: "100.00%",
        testedLabel: "Mar 2026",
        batch: "5026_0267",
        pdfUrl: "/coa/Certificate-of-Analysis-5026_0267-2026030628-02.pdf",
      },
      {
        labName: "Testides",
        scope: "Endotoxins + Purity",
        purity: "99.02%",
        testedLabel: "May 2026",
        batch: "VTL-TB5005",
        pdfUrl: "/coa/BW-TB500-5mg-050926-01.pdf",
      },
    ],
  },
  {
    slug: "tesamorelin-10mg",
    displayName: "Tesamorelin",
    composition: "GHRH analog",
    topPurity: "100.00%",
    topMethod: "HPLC-UV",
    verifiedByTwoLabs: true,
    labs: [
      {
        labName: "PPB Analytical Inc., Toronto",
        scope: "Heavy Metals + Purity",
        purity: "100.00%",
        testedLabel: "Mar 2026",
        batch: "5026_0273",
        pdfUrl: "/coa/Certificate-of-Analysis-5026_0273-2026030634-02.pdf",
      },
      {
        labName: "Testides",
        scope: "Endotoxins + Purity",
        purity: "99.67%",
        testedLabel: "May 2026",
        batch: "VTL-TES10102",
        pdfUrl: "/coa/BW-TESA-10mg-050926-01.pdf",
      },
    ],
  },
  {
    slug: "wolverine-stack-20mg",
    displayName: "Wolverine Stack",
    composition: "BPC-157 · TB-500",
    topPurity: "100.00%",
    topMethod: "HPLC-UV",
    verifiedByTwoLabs: false,
    labs: [
      {
        labName: "PPB Analytical Inc., Toronto",
        scope: "Heavy Metals + Purity",
        purity: "100.00%",
        testedLabel: "Mar 2026",
        batch: "5026_0253",
        pdfUrl: "/coa/Certificate-of-Analysis-5026_0253-2026030616-02.pdf",
      },
    ],
  },
  {
    slug: "mots-c-10mg",
    displayName: "MOTS-C",
    composition: "Mitochondrial-derived peptide",
    topPurity: "98.54%",
    topMethod: "HPLC-UV",
    verifiedByTwoLabs: true,
    labs: [
      {
        labName: "PPB Analytical Inc., Toronto",
        scope: "Heavy Metals + Purity",
        purity: "98.27%",
        testedLabel: "Mar 2026",
        batch: "5026_0258",
        pdfUrl: "/coa/Certificate-of-Analysis-5026_0258-2026030620-02.pdf",
      },
      {
        labName: "Testides",
        scope: "Endotoxins + Purity",
        purity: "98.54%",
        testedLabel: "Apr 2026",
        batch: "040626-01",
        pdfUrl: "/coa/BW-MOTS-10-040626-01.pdf",
      },
    ],
  },
  {
    slug: "klow-80mg",
    displayName: "KLOW 80mg",
    composition: "BPC-157 · TB-500 · GHK-Cu · KPV",
    topPurity: "98.67%",
    topMethod: "HPLC-UV",
    verifiedByTwoLabs: true,
    labs: [
      {
        labName: "PPB Analytical Inc., Toronto",
        scope: "Heavy Metals + Purity",
        purity: "97.65%",
        testedLabel: "Mar 2026",
        batch: "5026_0265",
        pdfUrl: "/coa/Certificate-of-Analysis-5026_0265-2026030626-02.pdf",
      },
      {
        labName: "Testides",
        scope: "Endotoxins + Purity",
        purity: "98.67%",
        testedLabel: "Apr 2026",
        batch: "040626-01",
        pdfUrl: "/coa/BW-KLOW-80-040626-01.pdf",
      },
    ],
  },
  {
    slug: "glow-70mg",
    displayName: "GLOW 70mg",
    composition: "BPC-157 · TB-500 · GHK-Cu",
    topPurity: "99.94%",
    topMethod: "HPLC-UV",
    verifiedByTwoLabs: true,
    labs: [
      {
        labName: "PPB Analytical Inc., Toronto",
        scope: "Heavy Metals + Purity",
        purity: "97.16%",
        testedLabel: "Mar 2026",
        batch: "5026_0255",
        pdfUrl: "/coa/Certificate-of-Analysis-5026_0255-2026030618-02.pdf",
      },
      {
        labName: "Testides",
        scope: "Endotoxins + Purity",
        purity: "99.94%",
        testedLabel: "Apr 2026",
        batch: "040626-01",
        pdfUrl: "/coa/BW-GLOW-70-040626-01.pdf",
      },
    ],
  },
  {
    slug: "aod-9604-5mg",
    displayName: "AOD-9604",
    composition: "Fragment 176-191",
    topPurity: "99.95%",
    topMethod: "HPLC-UV",
    verifiedByTwoLabs: false,
    labs: [
      {
        labName: "Testides",
        scope: "Endotoxins + Purity",
        purity: "99.95%",
        testedLabel: "May 2026",
        batch: "VTL-AOD10102",
        pdfUrl: "/coa/BW-AOD-10mg-050926-01.pdf",
      },
    ],
  },
  {
    slug: "cjc-1295-no-dac-5mg",
    displayName: "CJC-1295 without DAC",
    composition: "mod GRF (1-29)",
    topPurity: "99.74%",
    topMethod: "HPLC-UV",
    verifiedByTwoLabs: false,
    labs: [
      {
        labName: "Testides",
        scope: "Endotoxins + Purity",
        purity: "99.74%",
        testedLabel: "May 2026",
        batch: "VTL-CJC05102",
        pdfUrl: "/coa/BW-CJCN-5mg-050926-01.pdf",
      },
    ],
  },
  {
    slug: "epithalon-10mg",
    displayName: "Epithalon",
    composition: "Tetrapeptide",
    topPurity: "99.18%",
    topMethod: "HPLC-UV",
    verifiedByTwoLabs: false,
    labs: [
      {
        labName: "Testides",
        scope: "Endotoxins + Purity",
        purity: "99.18%",
        testedLabel: "May 2026",
        batch: "VTL-EPI70101",
        pdfUrl: "/coa/BW-EPI-10mg-050926-01.pdf",
      },
    ],
  },
  {
    slug: "ipamorelin-5mg",
    displayName: "Ipamorelin",
    composition: "Pentapeptide secretagogue",
    topPurity: "99.91%",
    topMethod: "HPLC-UV",
    verifiedByTwoLabs: false,
    labs: [
      {
        labName: "Testides",
        scope: "Endotoxins + Purity",
        purity: "99.91%",
        testedLabel: "May 2026",
        batch: "VTL-IPA10102",
        pdfUrl: "/coa/BW-IPA-10mg-050926-01.pdf",
      },
    ],
  },
  {
    slug: "kpv-10mg",
    displayName: "KPV",
    composition: "Tripeptide (α-MSH fragment)",
    topPurity: "99.74%",
    topMethod: "HPLC-UV",
    verifiedByTwoLabs: false,
    labs: [
      {
        labName: "Testides",
        scope: "Endotoxins + Purity",
        purity: "99.74%",
        testedLabel: "May 2026",
        batch: "VTL-KPV10102",
        pdfUrl: "/coa/BW-KPV-10mg-050926-01.pdf",
      },
    ],
  },
  {
    slug: "glutathione-1500mg",
    displayName: "Glutathione",
    composition: "Tripeptide antioxidant",
    topPurity: "99.96%",
    topMethod: "HPLC-UV",
    verifiedByTwoLabs: false,
    labs: [
      {
        labName: "Testides",
        scope: "Endotoxins + Purity",
        purity: "99.96%",
        testedLabel: "May 2026",
        batch: "VTL-GLU1500102",
        pdfUrl: "/coa/BW-LGLU-1500mg-050926-01.pdf",
      },
    ],
  },
  {
    slug: "mt-2-10mg",
    displayName: "MT-2",
    composition: "Melanotan II",
    topPurity: "99.91%",
    topMethod: "HPLC-UV",
    verifiedByTwoLabs: false,
    labs: [
      {
        labName: "Testides",
        scope: "Endotoxins + Purity",
        purity: "99.91%",
        testedLabel: "May 2026",
        batch: "VTL-MT210102",
        pdfUrl: "/coa/BW-MELA-10mg-050926-01.pdf",
      },
    ],
  },
  {
    slug: "pt-141-10mg",
    displayName: "PT-141",
    composition: "Bremelanotide",
    topPurity: "99.64%",
    topMethod: "HPLC-UV",
    verifiedByTwoLabs: false,
    labs: [
      {
        labName: "Testides",
        scope: "Endotoxins + Purity",
        purity: "99.64%",
        testedLabel: "May 2026",
        batch: "VTL-PT110102",
        pdfUrl: "/coa/BW-PT141-10mg-050926-01.pdf",
      },
    ],
  },
  {
    slug: "selank-10mg",
    displayName: "Selank",
    composition: "Heptapeptide",
    topPurity: "99.73%",
    topMethod: "HPLC-UV",
    verifiedByTwoLabs: false,
    labs: [
      {
        labName: "Testides",
        scope: "Endotoxins + Purity",
        purity: "99.73%",
        testedLabel: "May 2026",
        batch: "VTL-SEL10102",
        pdfUrl: "/coa/BW-SEL-10mg-050926-01.pdf",
      },
    ],
  },
  {
    slug: "semax-10mg",
    displayName: "Semax",
    composition: "Heptapeptide (ACTH fragment)",
    topPurity: "99.94%",
    topMethod: "HPLC-UV",
    verifiedByTwoLabs: false,
    labs: [
      {
        labName: "Testides",
        scope: "Endotoxins + Purity",
        purity: "99.94%",
        testedLabel: "May 2026",
        batch: "VTL-SEM10103",
        pdfUrl: "/coa/BW-SEMAX-10mg-050926-01.pdf",
      },
    ],
  },
  {
    slug: "thymosin-alpha-1-5mg",
    displayName: "Thymosin Alpha-1",
    composition: "Thymosin α1 peptide",
    topPurity: "99.49%",
    topMethod: "HPLC-UV",
    verifiedByTwoLabs: false,
    labs: [
      {
        labName: "Testides",
        scope: "Endotoxins + Purity",
        purity: "99.49%",
        testedLabel: "May 2026",
        batch: "VTL-TA10102",
        pdfUrl: "/coa/BW-TA1-10mg-050926-01.pdf",
      },
    ],
  },
  {
    slug: "tirzepatide-10mg",
    displayName: "Tirzepatide",
    composition: "Dual GIP/GLP-1 agonist",
    topPurity: "99.47%",
    topMethod: "HPLC-UV",
    verifiedByTwoLabs: false,
    labs: [
      {
        labName: "Testides",
        scope: "Endotoxins + Purity",
        purity: "99.47%",
        testedLabel: "May 2026",
        batch: "VTL-TIR10102",
        pdfUrl: "/coa/BW-TIRZ-10mg-050926-01.pdf",
      },
    ],
  },
];

export function getProductCoa(slug: string) {
  return productCoas.find((c) => c.slug === slug);
}

export function getAllProductCoas() {
  return productCoas;
}
