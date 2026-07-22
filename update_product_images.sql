-- ============================================================
-- HRP Website — Product Images
-- Sets image_url for all 103 products, matched by slug.
-- Every slug below has a matching file in public/images/products/.
-- Safe to re-run: UPDATE only, no inserts or deletes.
-- Run in: Supabase → SQL Editor → New Query → Run
-- ============================================================

UPDATE products SET image_url = '/images/products/' || v.slug || '.png'
FROM (VALUES

  -- Hydraulics (14)
  ('hydraulic-cylinders'),
  ('hydraulic-motors'),
  ('rotary-actuators'),
  ('directional-control-valves'),
  ('pressure-control-valves'),
  ('flow-control-valves'),
  ('proportional-servo-valves'),
  ('hydraulic-hoses'),
  ('hydraulic-fittings-adaptors'),
  ('hydraulic-quick-disconnect'),
  ('hydraulic-flanges-clamps'),
  ('hydraulic-filters-elements'),
  ('oil-coolers-heat-exchangers'),
  ('hydraulic-fluids-lubricants'),

  -- Instrumentation (18)
  ('pressure-gauges'),
  ('pressure-transmitters-transducers'),
  ('differential-pressure-instruments'),
  ('pressure-switches'),
  ('thermocouples-rtd'),
  ('temperature-transmitters'),
  ('bimetal-digital-thermometers'),
  ('thermowells'),
  ('rotameters-variable-area-flow-meters'),
  ('digital-flow-meters'),
  ('mass-flow-controllers'),
  ('flow-switches'),
  ('level-switches'),
  ('level-transmitters-sensors'),
  ('analytical-sensors'),
  ('hand-pumps-pressure-calibrators'),
  ('dry-block-temperature-calibrators'),
  ('multimeters-loop-calibrators'),

  -- Pneumatics (20)
  ('round-body-tie-rod-cylinders'),
  ('compact-flat-body-cylinders'),
  ('rodless-cylinders-braided'),
  ('pneumatic-rotary-actuators'),
  ('pneumatic-solenoid-valves'),
  ('air-pilot-mechanical-valves'),
  ('valve-manifolds-islands'),
  ('pneumatic-flow-check-valves'),
  ('air-filters-water-separators'),
  ('pneumatic-pressure-regulators'),
  ('air-lubricators'),
  ('modular-frl-combo-units'),
  ('push-to-connect-fittings'),
  ('threaded-fittings-adaptors'),
  ('pneumatic-tubing'),
  ('pneumatic-quick-disconnect'),
  ('pneumatic-silencers'),
  ('pneumatic-pressure-gauges'),
  ('air-blow-guns-nozzles'),
  ('air-compressors-storage-tanks'),

  -- Rubber Products (22)
  ('industrial-rubber-sheeting'),
  ('anti-fatigue-ergonomic-matting'),
  ('electrical-safety-insulation-matting'),
  ('skirt-board-conveyor-rubber'),
  ('rubber-o-ring-cord-stock'),
  ('edge-trims-u-channels'),
  ('d-strips-p-strips'),
  ('cylindrical-isolation-mounts'),
  ('vibration-isolation-pads'),
  ('heavy-duty-machinery-mounts'),
  ('rubber-bushings-grommets'),
  ('standard-o-rings-kits'),
  ('flange-gaskets'),
  ('oil-seals-rotary-shaft-seals'),
  ('inflatable-custom-moulded-seals'),
  ('suction-discharge-hose'),
  ('rubber-expansion-joints'),
  ('flexible-ducting'),
  ('recessed-stem-bumpers'),
  ('adhesive-backed-bumper-pads'),
  ('dock-bumpers'),
  ('end-caps-thread-protectors'),

  -- Vacuum Components (15)
  ('flat-suction-cups'),
  ('bellows-suction-cups'),
  ('oval-rectangular-suction-cups'),
  ('specialty-cups-grippers'),
  ('pneumatic-vacuum-ejectors-venturi'),
  ('electric-rotary-vane-vacuum-pumps'),
  ('central-vacuum-stations'),
  ('vacuum-solenoid-valves'),
  ('blow-off-fast-release-valves'),
  ('vacuum-check-valves'),
  ('vacuum-filters'),
  ('digital-vacuum-switches-sensors'),
  ('analog-vacuum-gauges'),
  ('area-gripping-systems-foam-pads'),
  ('robotic-end-effectors'),

  -- Valves (14)
  ('ball-valves'),
  ('butterfly-valves'),
  ('plug-valves'),
  ('gate-valves'),
  ('globe-valves'),
  ('needle-valves'),
  ('check-valves'),
  ('foot-valves'),
  ('safety-relief-valves'),
  ('pressure-reducing-valves'),
  ('pilot-operated-pressure-regulators'),
  ('sanitary-hygienic-valves'),
  ('diaphragm-valves'),
  ('pinch-valves')
) AS v(slug)
WHERE products.slug = v.slug;

-- ── Done: image_url set for 103 products ─────────────────
-- Verify: SELECT count(*) FROM products WHERE image_url IS NOT NULL;  -- expect 103
