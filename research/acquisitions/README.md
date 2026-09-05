# Acquisition study: statistics reproduction

These files reproduce the group summaries from saved CAR values, not the full research pipeline. Run `python3 reproduce_published_stats.py` after installing pandas and scipy.

The AS_SAVED file preserves the received data. DERIVED_corrected changes Coeur (CDE, 2024-10-04) from cash to stock and adds label_source. Other classifications, event dates, independence, and saved returns have not been exhaustively validated. Filing links are in each CSV.

The reproduction script was written during the September 2026 handoff audit, not recovered from the original study. It identifies Welch tests by matching published results. Missing intermediate files prevent reproduction from raw filings and prices. Window counts are 37, 35, and 33 rather than all 45 rows. Do not treat repeated acquirers or possible duplicate deals as independently verified events.
