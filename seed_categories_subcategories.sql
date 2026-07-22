-- ============================================================
-- HRP Website — Full Catalogue Seed
-- 6 categories · 25 subcategories · 103 products
-- Safe to re-run. Run in: Supabase → SQL Editor → New Query
-- ============================================================


-- ── 1. CATEGORIES (upsert on slug) ───────────────────────────
INSERT INTO categories (name, slug, description, sort_order)
VALUES
  ('Hydraulics',        'hydraulics',        'Hydraulic actuators, valves, hoses, fittings, filtration and fluid power components.',          1),
  ('Pneumatics',        'pneumatics',        'Pneumatic cylinders, valves, FRL units, fittings, tubing and air tools.',                       2),
  ('Valves',            'valves',            'Ball, gate, globe, butterfly, check and specialty valves for precise flow control.',             3),
  ('Instrumentation',   'instrumentation',   'Pressure, temperature, flow and level measurement instruments and calibration equipment.',       4),
  ('Rubber Products',   'rubber-products',   'Rubber sheets, extrusions, vibration mounts, seals, gaskets, hoses and bumpers.',               5),
  ('Vacuum Components', 'vacuum-components', 'Vacuum suction cups, pumps, generators, valves, filters and gripping systems.',                 6)
ON CONFLICT (slug) DO UPDATE SET
  name        = EXCLUDED.name,
  description = EXCLUDED.description,
  sort_order  = EXCLUDED.sort_order;


-- ── 2. CLEAR PRODUCTS first (FK safety before subcategory delete) ─
DELETE FROM products WHERE category_slug IN (
  'hydraulics','pneumatics','valves','instrumentation','rubber-products','vacuum-components'
);


-- ── 3. SUBCATEGORIES (delete + insert per category) ──────────

DELETE FROM subcategories WHERE category_slug = 'hydraulics';
INSERT INTO subcategories (name, category_slug, sort_order) VALUES
  ('Hydraulic Actuators',             'hydraulics', 1),
  ('Hydraulic Valves',                'hydraulics', 2),
  ('Hoses, Fittings & Connectors',    'hydraulics', 3),
  ('Fluids, Filtration & Reservoirs', 'hydraulics', 4);

DELETE FROM subcategories WHERE category_slug = 'pneumatics';
INSERT INTO subcategories (name, category_slug, sort_order) VALUES
  ('Pneumatic Actuators & Cylinders',    'pneumatics', 1),
  ('Pneumatic Valves & Manifolds',       'pneumatics', 2),
  ('Air Preparation - FRL Units',        'pneumatics', 3),
  ('Pneumatic Fittings, Tubing & Hoses', 'pneumatics', 4),
  ('Accessories & Air Tools',            'pneumatics', 5);

DELETE FROM subcategories WHERE category_slug = 'valves';
INSERT INTO subcategories (name, category_slug, sort_order) VALUES
  ('Quarter Turn & Shut-off Valves',   'valves', 1),
  ('Multi-Turn & Throttling Valves',   'valves', 2),
  ('Directional & Backflow Valves',    'valves', 3),
  ('Pressure Control & Safety Relief', 'valves', 4),
  ('Specialty & Industrial Valves',    'valves', 5);

DELETE FROM subcategories WHERE category_slug = 'instrumentation';
INSERT INTO subcategories (name, category_slug, sort_order) VALUES
  ('Pressure Measurement',           'instrumentation', 1),
  ('Temperature Measurement',        'instrumentation', 2),
  ('Flow Measurement',               'instrumentation', 3),
  ('Level & Analytical Measurement', 'instrumentation', 4),
  ('Calibration & Test Equipment',   'instrumentation', 5);

DELETE FROM subcategories WHERE category_slug = 'rubber-products';
INSERT INTO subcategories (name, category_slug, sort_order) VALUES
  ('Rubber Sheets & Matting',                   'rubber-products', 1),
  ('Rubber Extrusions, Profiles & Cords',       'rubber-products', 2),
  ('Vibration & Anti-Vibration Isolation',      'rubber-products', 3),
  ('Sealing, Gaskets & O-Rings',                'rubber-products', 4),
  ('Industrial Rubber Hose & Expansion Joints', 'rubber-products', 5),
  ('Rubber Bumpers, Caps & Nipples',            'rubber-products', 6);

DELETE FROM subcategories WHERE category_slug = 'vacuum-components';
INSERT INTO subcategories (name, category_slug, sort_order) VALUES
  ('Vacuum Suction Cups & Pads',        'vacuum-components', 1),
  ('Vacuum Pumps & Generators',         'vacuum-components', 2),
  ('Vacuum Valves & Controllers',       'vacuum-components', 3),
  ('Filters, Gauges & Instrumentation', 'vacuum-components', 4),
  ('Vacuum Gripping Systems',           'vacuum-components', 5);


-- ── 4. PRODUCTS (insert with subcategory_id resolved by JOIN) ─
-- Pattern: SELECT from a VALUES list and JOIN subcategories to get the UUID.
-- Columns: name, slug, category_slug, subcategory_name, subcategory_id, sort_order

-- ── Hydraulics ───────────────────────────────────────────────
INSERT INTO products (name, slug, category_slug, subcategory_name, subcategory_id, sort_order)
SELECT v.name, v.slug, v.cat, v.subcat, s.id, v.ord
FROM (VALUES
  -- Hydraulic Actuators
  ('Hydraulic Cylinders',              'hydraulic-cylinders',            'hydraulics', 'Hydraulic Actuators',             1),
  ('Hydraulic Motors',                 'hydraulic-motors',               'hydraulics', 'Hydraulic Actuators',             2),
  ('Rotary Actuators',                 'rotary-actuators',               'hydraulics', 'Hydraulic Actuators',             3),
  -- Hydraulic Valves
  ('Directional Control Valves',       'directional-control-valves',     'hydraulics', 'Hydraulic Valves',                4),
  ('Pressure Control Valves',          'pressure-control-valves',        'hydraulics', 'Hydraulic Valves',                5),
  ('Flow Control Valves',              'flow-control-valves',            'hydraulics', 'Hydraulic Valves',                6),
  ('Proportional & Servo Valves',      'proportional-servo-valves',      'hydraulics', 'Hydraulic Valves',                7),
  -- Hoses, Fittings & Connectors
  ('Hydraulic Hoses',                  'hydraulic-hoses',                'hydraulics', 'Hoses, Fittings & Connectors',    8),
  ('Hydraulic Fittings & Adaptors',    'hydraulic-fittings-adaptors',    'hydraulics', 'Hoses, Fittings & Connectors',    9),
  ('Quick Disconnect Couplings',       'hydraulic-quick-disconnect',     'hydraulics', 'Hoses, Fittings & Connectors',   10),
  ('Flanges & Clamps',                 'hydraulic-flanges-clamps',       'hydraulics', 'Hoses, Fittings & Connectors',   11),
  -- Fluids, Filtration & Reservoirs
  ('Hydraulic Filters & Elements',     'hydraulic-filters-elements',     'hydraulics', 'Fluids, Filtration & Reservoirs', 12),
  ('Oil Coolers & Heat Exchangers',    'oil-coolers-heat-exchangers',    'hydraulics', 'Fluids, Filtration & Reservoirs', 13),
  ('Hydraulic Fluids & Lubricants',    'hydraulic-fluids-lubricants',    'hydraulics', 'Fluids, Filtration & Reservoirs', 14)
) AS v(name, slug, cat, subcat, ord)
JOIN subcategories s ON s.name = v.subcat AND s.category_slug = v.cat;

-- ── Pneumatics ───────────────────────────────────────────────
INSERT INTO products (name, slug, category_slug, subcategory_name, subcategory_id, sort_order)
SELECT v.name, v.slug, v.cat, v.subcat, s.id, v.ord
FROM (VALUES
  -- Pneumatic Actuators & Cylinders
  ('Round Body & Tie Rod Cylinders',         'round-body-tie-rod-cylinders',      'pneumatics', 'Pneumatic Actuators & Cylinders',     1),
  ('Compact & Flat Body Cylinders',          'compact-flat-body-cylinders',       'pneumatics', 'Pneumatic Actuators & Cylinders',     2),
  ('Rodless Cylinders & Braided Actuators',  'rodless-cylinders-braided',         'pneumatics', 'Pneumatic Actuators & Cylinders',     3),
  ('Rotary Actuators & Air Grippers',        'pneumatic-rotary-actuators',        'pneumatics', 'Pneumatic Actuators & Cylinders',     4),
  -- Pneumatic Valves & Manifolds
  ('Solenoid Valves',                        'pneumatic-solenoid-valves',         'pneumatics', 'Pneumatic Valves & Manifolds',        5),
  ('Air Pilot & Mechanical Valves',          'air-pilot-mechanical-valves',       'pneumatics', 'Pneumatic Valves & Manifolds',        6),
  ('Valve Manifolds & Islands',              'valve-manifolds-islands',           'pneumatics', 'Pneumatic Valves & Manifolds',        7),
  ('Pneumatic Flow & Check Valves',          'pneumatic-flow-check-valves',       'pneumatics', 'Pneumatic Valves & Manifolds',        8),
  -- Air Preparation - FRL Units
  ('Air Filters & Water Separators',         'air-filters-water-separators',      'pneumatics', 'Air Preparation - FRL Units',         9),
  ('Pressure Regulators',                    'pneumatic-pressure-regulators',     'pneumatics', 'Air Preparation - FRL Units',        10),
  ('Air Lubricators',                        'air-lubricators',                   'pneumatics', 'Air Preparation - FRL Units',        11),
  ('Modular FRL Combo Units',                'modular-frl-combo-units',           'pneumatics', 'Air Preparation - FRL Units',        12),
  -- Pneumatic Fittings, Tubing & Hoses
  ('Push-to-Connect Fittings',               'push-to-connect-fittings',          'pneumatics', 'Pneumatic Fittings, Tubing & Hoses', 13),
  ('Threaded Fittings & Adaptors',           'threaded-fittings-adaptors',        'pneumatics', 'Pneumatic Fittings, Tubing & Hoses', 14),
  ('Pneumatic Tubing',                       'pneumatic-tubing',                  'pneumatics', 'Pneumatic Fittings, Tubing & Hoses', 15),
  ('Pneumatic Quick Disconnect Couplings',   'pneumatic-quick-disconnect',        'pneumatics', 'Pneumatic Fittings, Tubing & Hoses', 16),
  -- Accessories & Air Tools
  ('Pneumatic Silencers',                    'pneumatic-silencers',               'pneumatics', 'Accessories & Air Tools',            17),
  ('Pressure Gauges & Digital Switches',     'pneumatic-pressure-gauges',         'pneumatics', 'Accessories & Air Tools',            18),
  ('Air Blow Guns & Nozzles',                'air-blow-guns-nozzles',             'pneumatics', 'Accessories & Air Tools',            19),
  ('Air Compressors & Storage Tanks',        'air-compressors-storage-tanks',     'pneumatics', 'Accessories & Air Tools',            20)
) AS v(name, slug, cat, subcat, ord)
JOIN subcategories s ON s.name = v.subcat AND s.category_slug = v.cat;

-- ── Valves ───────────────────────────────────────────────────
INSERT INTO products (name, slug, category_slug, subcategory_name, subcategory_id, sort_order)
SELECT v.name, v.slug, v.cat, v.subcat, s.id, v.ord
FROM (VALUES
  -- Quarter Turn & Shut-off Valves
  ('Ball Valves',                        'ball-valves',                       'valves', 'Quarter Turn & Shut-off Valves',   1),
  ('Butterfly Valves',                   'butterfly-valves',                  'valves', 'Quarter Turn & Shut-off Valves',   2),
  ('Plug Valves',                        'plug-valves',                       'valves', 'Quarter Turn & Shut-off Valves',   3),
  -- Multi-Turn & Throttling Valves
  ('Gate Valves',                        'gate-valves',                       'valves', 'Multi-Turn & Throttling Valves',   4),
  ('Globe Valves',                       'globe-valves',                      'valves', 'Multi-Turn & Throttling Valves',   5),
  ('Needle Valves',                      'needle-valves',                     'valves', 'Multi-Turn & Throttling Valves',   6),
  -- Directional & Backflow Valves
  ('Check Valves',                       'check-valves',                      'valves', 'Directional & Backflow Valves',    7),
  ('Foot Valves',                        'foot-valves',                       'valves', 'Directional & Backflow Valves',    8),
  -- Pressure Control & Safety Relief
  ('Safety Relief Valves',               'safety-relief-valves',              'valves', 'Pressure Control & Safety Relief', 9),
  ('Pressure Reducing Valves',           'pressure-reducing-valves',          'valves', 'Pressure Control & Safety Relief',10),
  ('Pilot Operated Pressure Regulators', 'pilot-operated-pressure-regulators','valves', 'Pressure Control & Safety Relief',11),
  -- Specialty & Industrial Valves
  ('Sanitary & Hygienic Valves',         'sanitary-hygienic-valves',          'valves', 'Specialty & Industrial Valves',   12),
  ('Diaphragm Valves',                   'diaphragm-valves',                  'valves', 'Specialty & Industrial Valves',   13),
  ('Pinch Valves',                       'pinch-valves',                      'valves', 'Specialty & Industrial Valves',   14)
) AS v(name, slug, cat, subcat, ord)
JOIN subcategories s ON s.name = v.subcat AND s.category_slug = v.cat;

-- ── Instrumentation ──────────────────────────────────────────
INSERT INTO products (name, slug, category_slug, subcategory_name, subcategory_id, sort_order)
SELECT v.name, v.slug, v.cat, v.subcat, s.id, v.ord
FROM (VALUES
  -- Pressure Measurement
  ('Pressure Gauges',                         'pressure-gauges',                       'instrumentation', 'Pressure Measurement',           1),
  ('Pressure Transmitters & Transducers',     'pressure-transmitters-transducers',     'instrumentation', 'Pressure Measurement',           2),
  ('Differential Pressure Instruments',       'differential-pressure-instruments',     'instrumentation', 'Pressure Measurement',           3),
  ('Pressure Switches',                       'pressure-switches',                     'instrumentation', 'Pressure Measurement',           4),
  -- Temperature Measurement
  ('Thermocouples & RTD',                     'thermocouples-rtd',                     'instrumentation', 'Temperature Measurement',        5),
  ('Temperature Transmitters',                'temperature-transmitters',              'instrumentation', 'Temperature Measurement',        6),
  ('Bimetal & Digital Thermometers',          'bimetal-digital-thermometers',          'instrumentation', 'Temperature Measurement',        7),
  ('Thermowells',                             'thermowells',                           'instrumentation', 'Temperature Measurement',        8),
  -- Flow Measurement
  ('Rotameters & Variable Area Flow Meters',  'rotameters-variable-area-flow-meters',  'instrumentation', 'Flow Measurement',               9),
  ('Digital Flow Meters',                     'digital-flow-meters',                   'instrumentation', 'Flow Measurement',              10),
  ('Mass Flow Controllers',                   'mass-flow-controllers',                 'instrumentation', 'Flow Measurement',              11),
  ('Flow Switches',                           'flow-switches',                         'instrumentation', 'Flow Measurement',              12),
  -- Level & Analytical Measurement
  ('Level Switches',                          'level-switches',                        'instrumentation', 'Level & Analytical Measurement', 13),
  ('Level Transmitters & Sensors',            'level-transmitters-sensors',            'instrumentation', 'Level & Analytical Measurement', 14),
  ('Analytical Sensors',                      'analytical-sensors',                    'instrumentation', 'Level & Analytical Measurement', 15),
  -- Calibration & Test Equipment
  ('Hand Pumps & Pressure Calibrators',       'hand-pumps-pressure-calibrators',       'instrumentation', 'Calibration & Test Equipment',   16),
  ('Dry Block & Temperature Calibrators',     'dry-block-temperature-calibrators',     'instrumentation', 'Calibration & Test Equipment',   17),
  ('Multimeters & Loop Calibrators',          'multimeters-loop-calibrators',          'instrumentation', 'Calibration & Test Equipment',   18)
) AS v(name, slug, cat, subcat, ord)
JOIN subcategories s ON s.name = v.subcat AND s.category_slug = v.cat;

-- ── Rubber Products ──────────────────────────────────────────
INSERT INTO products (name, slug, category_slug, subcategory_name, subcategory_id, sort_order)
SELECT v.name, v.slug, v.cat, v.subcat, s.id, v.ord
FROM (VALUES
  -- Rubber Sheets & Matting
  ('Industrial Rubber Sheeting',              'industrial-rubber-sheeting',            'rubber-products', 'Rubber Sheets & Matting',                   1),
  ('Anti-Fatigue & Ergonomic Matting',        'anti-fatigue-ergonomic-matting',        'rubber-products', 'Rubber Sheets & Matting',                   2),
  ('Electrical Safety & Insulation Matting',  'electrical-safety-insulation-matting',  'rubber-products', 'Rubber Sheets & Matting',                   3),
  ('Skirt Board & Conveyor Rubber',           'skirt-board-conveyor-rubber',           'rubber-products', 'Rubber Sheets & Matting',                   4),
  -- Rubber Extrusions, Profiles & Cords
  ('Rubber O-Ring Cord Stock',                'rubber-o-ring-cord-stock',              'rubber-products', 'Rubber Extrusions, Profiles & Cords',       5),
  ('Edge Trims & U-Channels',                 'edge-trims-u-channels',                 'rubber-products', 'Rubber Extrusions, Profiles & Cords',       6),
  ('D-Strips & P-Strips',                     'd-strips-p-strips',                     'rubber-products', 'Rubber Extrusions, Profiles & Cords',       7),
  -- Vibration & Anti-Vibration Isolation
  ('Cylindrical Isolation Mounts',            'cylindrical-isolation-mounts',          'rubber-products', 'Vibration & Anti-Vibration Isolation',      8),
  ('Vibration Isolation Pads',                'vibration-isolation-pads',              'rubber-products', 'Vibration & Anti-Vibration Isolation',      9),
  ('Heavy Duty Machinery Mounts',             'heavy-duty-machinery-mounts',           'rubber-products', 'Vibration & Anti-Vibration Isolation',     10),
  ('Rubber Bushings & Grommets',              'rubber-bushings-grommets',              'rubber-products', 'Vibration & Anti-Vibration Isolation',     11),
  -- Sealing, Gaskets & O-Rings
  ('Standard O-Rings & O-Ring Kits',          'standard-o-rings-kits',                 'rubber-products', 'Sealing, Gaskets & O-Rings',               12),
  ('Flange Gaskets',                          'flange-gaskets',                        'rubber-products', 'Sealing, Gaskets & O-Rings',               13),
  ('Oil Seals & Rotary Shaft Seals',          'oil-seals-rotary-shaft-seals',          'rubber-products', 'Sealing, Gaskets & O-Rings',               14),
  ('Inflatable & Custom Moulded Seals',       'inflatable-custom-moulded-seals',       'rubber-products', 'Sealing, Gaskets & O-Rings',               15),
  -- Industrial Rubber Hose & Expansion Joints
  ('Suction & Discharge Hose',                'suction-discharge-hose',                'rubber-products', 'Industrial Rubber Hose & Expansion Joints', 16),
  ('Rubber Expansion Joints',                 'rubber-expansion-joints',               'rubber-products', 'Industrial Rubber Hose & Expansion Joints', 17),
  ('Flexible Ducting',                        'flexible-ducting',                      'rubber-products', 'Industrial Rubber Hose & Expansion Joints', 18),
  -- Rubber Bumpers, Caps & Nipples
  ('Recessed & Stem Bumpers',                 'recessed-stem-bumpers',                 'rubber-products', 'Rubber Bumpers, Caps & Nipples',            19),
  ('Adhesive Backed Rubber Bumper Pads',      'adhesive-backed-bumper-pads',           'rubber-products', 'Rubber Bumpers, Caps & Nipples',            20),
  ('Dock Bumpers',                            'dock-bumpers',                          'rubber-products', 'Rubber Bumpers, Caps & Nipples',            21),
  ('End Caps & Thread Protectors',            'eqqqqqqqqqqqqqqqqqqnd-caps-thread-protectors',            'rubber-products', 'Rubber Bumpers, Caps & Nipples',            22)
) AS v(name, slug, cat, subcat, ord)
JOIN subcategories s ON s.name = v.subcat AND s.category_slug = v.cat;

-- ── Vacuum Components ────────────────────────────────────────
INSERT INTO products (name, slug, category_slug, subcategory_name, subcategory_id, sort_order)
SELECT v.name, v.slug, v.cat, v.subcat, s.id, v.ord
FROM (VALUES
  -- Vacuum Suction Cups & Pads
  ('Flat Suction Cups',                       'flat-suction-cups',                     'vacuum-components', 'Vacuum Suction Cups & Pads',        1),
  ('Bellows Suction Cups',                    'bellows-suction-cups',                  'vacuum-components', 'Vacuum Suction Cups & Pads',        2),
  ('Oval & Rectangular Suction Cups',         'oval-rectangular-suction-cups',         'vacuum-components', 'Vacuum Suction Cups & Pads',        3),
  ('Specialty Cups & Grippers',               'specialty-cups-grippers',               'vacuum-components', 'Vacuum Suction Cups & Pads',        4),
  -- Vacuum Pumps & Generators
  ('Pneumatic Vacuum Ejectors & Venturi',     'pneumatic-vacuum-ejectors-venturi',     'vacuum-components', 'Vacuum Pumps & Generators',         5),
  ('Electric & Rotary Vane Vacuum Pumps',     'electric-rotary-vane-vacuum-pumps',     'vacuum-components', 'Vacuum Pumps & Generators',         6),
  ('Central Vacuum Stations',                 'central-vacuum-stations',               'vacuum-components', 'Vacuum Pumps & Generators',         7),
  -- Vacuum Valves & Controllers
  ('Vacuum Solenoid Valves',                  'vacuum-solenoid-valves',                'vacuum-components', 'Vacuum Valves & Controllers',       8),
  ('Blow-off & Fast Release Valves',          'blow-off-fast-release-valves',          'vacuum-components', 'Vacuum Valves & Controllers',       9),
  ('Vacuum Check Valves',                     'vacuum-check-valves',                   'vacuum-components', 'Vacuum Valves & Controllers',      10),
  -- Filters, Gauges & Instrumentation
  ('Vacuum Filters',                          'vacuum-filters',                        'vacuum-components', 'Filters, Gauges & Instrumentation', 11),
  ('Digital Vacuum Switches & Sensors',       'digital-vacuum-switches-sensors',       'vacuum-components', 'Filters, Gauges & Instrumentation', 12),
  ('Analog Vacuum Gauges',                    'analog-vacuum-gauges',                  'vacuum-components', 'Filters, Gauges & Instrumentation', 13),
  -- Vacuum Gripping Systems
  ('Area Gripping Systems & Foam Pads',       'area-gripping-systems-foam-pads',       'vacuum-components', 'Vacuum Gripping Systems',          14),
  ('Robotic End Effectors',                   'robotic-end-effectors',                 'vacuum-components', 'Vacuum Gripping Systems',          15)
) AS v(name, slug, cat, subcat, ord)
JOIN subcategories s ON s.name = v.subcat AND s.category_slug = v.cat;

-- ── Done: 6 categories · 25 subcategories · 103 products ─────
