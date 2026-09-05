"""
Reproduces the two competing sets of numbers for the 45-deal cash-vs-stock study.

Written 2026-09-04 during the handoff audit. This script was NOT part of the
original research pipeline. It exists to demonstrate, from the saved data alone,
that the published table equals the saved data with exactly one label flipped.

Run:  python3 reproduce_published_stats.py ../data/deals_final_AS_SAVED_uncorrected.csv

Verified result (2026-09-04):
  "AS SAVED" reproduces RESULTS_precorrection_2026-08-30.md exactly.
  "COEUR FLIPPED" reproduces MA_Event_Study_Report_2026-08-31.pdf and the
  published post at /posts/cash-vs-stock-45-deals.html exactly, to 4 decimals.

Test identification note: the test types below (one-sample t vs zero per group,
Welch two-sample t for the gap) were identified by replication, not read from an
original stats script. No original stats script survives. The match is exact,
which is strong but not the same as having the source.
"""
import sys
import pandas as pd
from scipy import stats

path = sys.argv[1] if len(sys.argv) > 1 else str(__import__("pathlib").Path(__file__).with_name("deals_final_AS_SAVED_uncorrected.csv"))


def report(df, tag):
    print("\n=== " + tag + " ===")
    print(df["label"].value_counts().to_dict())
    for w in (1, 3, 5):
        col = "CAR%d" % w
        cash = df[df.label == "cash"][col].dropna()
        stock = df[df.label == "stock"][col].dropna()
        pc = stats.ttest_1samp(cash, 0).pvalue
        ps = stats.ttest_1samp(stock, 0).pvalue
        pg = stats.ttest_ind(cash, stock, equal_var=False).pvalue
        va = cash.var(ddof=1) / len(cash)
        vb = stock.var(ddof=1) / len(stock)
        se = (va + vb) ** 0.5
        dof = (va + vb) ** 2 / (va ** 2 / (len(cash)-1) + vb ** 2 / (len(stock)-1))
        gap = cash.mean() - stock.mean()
        margin = stats.t.ppf(0.975, dof) * se
        print("Welch 95%% CI for cash-minus-stock gap: %+.2f to %+.2fpp" % (gap-margin, gap+margin))
        print(
            "[-%d,+%d]  cash n=%2d %+.2f%% p=%.4f | stock n=%2d %+.2f%% p=%.4f | gap %+.2fpp p=%.4f"
            % (w, w, len(cash), cash.mean(), pc, len(stock), stock.mean(), ps,
               cash.mean() - stock.mean(), pg)
        )


d = pd.read_csv(path)
print("rows loaded:", len(d))
report(d, "AS SAVED (matches RESULTS.md, pre-correction)")

d2 = d.copy()
d2.loc[(d2.ticker == "CDE") & (d2.file_date == "2024-10-04"), "label"] = "stock"
report(d2, "COEUR FLIPPED cash->stock (matches PDF and published post)")

print(
    "\nNote: no event window uses all 45 deals. Effective n is 37 / 35 / 33 "
    "because the confound screen nulls contaminated windows rather than "
    "dropping rows."
)
