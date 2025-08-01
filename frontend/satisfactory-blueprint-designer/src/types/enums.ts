// src/types/enums.ts

/** Building types */
export type BuildingType =
  | 'SMELTER'
  | 'CONSTRUCTOR'
  | 'ASSEMBLER'
  | 'MANUFACTURER'
  | 'REFINERY'
  | 'BLENDER'
  | 'FOUNDRY'
  | 'PARTICLE_ACCELERATOR'
  | 'PACKAGER'
  | 'CONVERTER'
  | 'QUANTUM_ENCODER';

export const BuildingTypes: BuildingType[] = [
  'SMELTER',
  'CONSTRUCTOR',
  'ASSEMBLER',
  'MANUFACTURER',
  'REFINERY',
  'BLENDER',
  'FOUNDRY',
  'PARTICLE_ACCELERATOR',
  'PACKAGER',
  'CONVERTER',
  'QUANTUM_ENCODER',
];

/** Fuel types */
export type FuelType =
  | 'COAL'
  | 'COMPACTED_COAL'
  | 'PETROLEUM_COKE'
  | 'WATER'
  | 'FUEL'
  | 'LIQUID_BIOFUEL'
  | 'TURBOFUEL'
  | 'ROCKET_FUEL'
  | 'IONIZED_FUEL'
  | 'URANIUM_FUEL_ROD'
  | 'PLUTONIUM_FUEL_ROD'
  | 'FICSONIUM_FUEL_ROD'
  | 'BIOMASS'
  | 'SOLID_BIOFUEL'
  | 'WOOD'
  | 'LEAVES'
  | 'GEOTHERMAL';

export const FuelTypes: FuelType[] = [
  'COAL',
  'COMPACTED_COAL',
  'PETROLEUM_COKE',
  'WATER',
  'FUEL',
  'LIQUID_BIOFUEL',
  'TURBOFUEL',
  'ROCKET_FUEL',
  'IONIZED_FUEL',
  'URANIUM_FUEL_ROD',
  'PLUTONIUM_FUEL_ROD',
  'FICSONIUM_FUEL_ROD',
  'BIOMASS',
  'SOLID_BIOFUEL',
  'WOOD',
  'LEAVES',
  'GEOTHERMAL',
];

/** Owner types */
export type OwnerType = 'ITEM' | 'BUILDING' | 'GENERATOR';
export const OwnerTypes: OwnerType[] = ['ITEM', 'BUILDING', 'GENERATOR'];

/** Generator types */
export type GeneratorType =
  | 'BIOMASS_BURNER'
  | 'COAL_GENERATOR'
  | 'FUEL_GENERATOR'
  | 'NUCLEAR_REACTOR'
  | 'GEOTHERMAL_GENERATOR';

export const GeneratorTypes: GeneratorType[] = [
  'BIOMASS_BURNER',
  'COAL_GENERATOR',
  'FUEL_GENERATOR',
  'NUCLEAR_REACTOR',
  'GEOTHERMAL_GENERATOR',
];

/** Planner modes */
export type PlannerMode = 'FUEL' | 'FACTORY';
export const PlannerModes: PlannerMode[] = ['FUEL', 'FACTORY'];

/** Planner target types */
export type PlannerTargetType = 'GENERATOR' | 'FUEL';
export const PlannerTargetTypes: PlannerTargetType[] = ['FUEL', 'GENERATOR'];

/** Vehicle types */
export type VehicleType = 'TRAIN' | 'TRUCK' | 'PLANE';
export const VehicleTypes: VehicleType[] = ['TRAIN', 'TRUCK', 'PLANE'];
