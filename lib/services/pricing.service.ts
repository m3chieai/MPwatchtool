interface PricingParams {
  baseMarketPrice: number;
  referenceNumber: string; 
  condition: 'NEW_UNWORN' | 'EXCELLENT' | 'VERY_GOOD' | 'GOOD';
  hasBox: boolean;
  hasPapers: boolean;
  hasOriginalBracelet: boolean;
  yearOfManufacture: number;
  isHighDemand?: boolean;
  isLowDemand?: boolean;
}

interface PricingBreakdown {
  baseMarketPrice: number;
  materialMultiplier: number;
  materialAdjustment: number;
  conditionMultiplier: number;
  conditionAdjustment: number;
  boxPapersMultiplier: number;
  boxPapersAdjustment: number;
  liquidityMultiplier: number;
  liquidityAdjustment: number;
  subtotal: number;
  riskBuffer: number;
  watchAge: number;
  applicableMargin: number;
  marginPercentage: number;
  marginAmount: number;
  finalQuote: number;
}

export class PricingCalculator {
  // Rolex Material Multipliers based on the last digit of the reference
  private materialMultipliers: Record<string, number> = {
    '0': 1.00,  // Stainless Steel
    '1': 1.30,  // Everose Rolesor (Steel/Rose Gold)
    '2': 1.35,  // Rolesium (Steel/Platinum)
    '3': 1.25,  // Yellow Rolesor (Two-Tone Steel/Yellow Gold)
    '4': 1.10,  // White Rolesor (Steel/White Gold Bezel)
    '5': 1.90,  // 18k Everose Gold (Solid)
    '6': 2.80,  // Platinum (Solid)
    '8': 2.20,  // 18k Yellow Gold (Solid)
    '9': 2.30,  // 18k White Gold (Solid)
  };

  private conditionMultipliers = {
    NEW_UNWORN: 1.000,
    EXCELLENT: 0.920,
    VERY_GOOD: 0.820,
    GOOD: 0.680,
  };

  private boxPapersMultipliers = {
    fullSet: 1.080,
    boxOnly: 1.030,
    papersOnly: 1.040,
    none: 1.000,
  };

  private liquidityMultipliers = {
    high: 1.050,
    standard: 1.000,
    low: 0.920,
  };

  private riskBuffer = 500;

  /**
   * Determine material multiplier from reference number
   */
  private getMaterialMultiplier = (referenceNumber: string): number => {
    const lastDigit = referenceNumber.trim().slice(-1);
    return this.materialMultipliers[lastDigit] || 1.00;
  };

  /**
   * Calculate final quote with complete breakdown
   */
  calculateQuote = (params: PricingParams): PricingBreakdown => {
    const currentYear = new Date().getFullYear();
    const watchAge = currentYear - params.yearOfManufacture;

    // Step 0: Apply material multiplier (The Valuation Anchor)
    const materialMultiplier = this.getMaterialMultiplier(params.referenceNumber);
    const materialAdjustedBase = params.baseMarketPrice * materialMultiplier;

    // Step 1: Apply condition multiplier
    const conditionMultiplier = this.conditionMultipliers[params.condition];
    const conditionAdjustment = materialAdjustedBase * conditionMultiplier;

    // Step 2: Apply box & papers multiplier
    const boxPapersMultiplier = this.getBoxPapersMultiplier(
      params.hasBox,
      params.hasPapers
    );
    const boxPapersAdjustment = conditionAdjustment * boxPapersMultiplier;

    // Step 3: Apply liquidity multiplier
    const liquidityMultiplier = this.getLiquidityMultiplier(
      params.isHighDemand,
      params.isLowDemand
    );
    const liquidityAdjustment = boxPapersAdjustment * liquidityMultiplier;

    const subtotal = liquidityAdjustment;

    // Step 5: Determine year-based margin
    const marginPercentage = this.getYearBasedMargin(watchAge, params.condition);
    const marginAmount = subtotal * (marginPercentage / 100);

    // Step 6: Calculate final quote
    const finalQuote = subtotal - this.riskBuffer - marginAmount;

    return {
      baseMarketPrice: params.baseMarketPrice,
      materialMultiplier,
      materialAdjustment: materialAdjustedBase - params.baseMarketPrice,
      conditionMultiplier,
      conditionAdjustment: conditionAdjustment - materialAdjustedBase,
      boxPapersMultiplier,
      boxPapersAdjustment: boxPapersAdjustment - conditionAdjustment,
      liquidityMultiplier,
      liquidityAdjustment: liquidityAdjustment - boxPapersAdjustment,
      subtotal,
      riskBuffer: this.riskBuffer,
      watchAge,
      applicableMargin: marginPercentage,
      marginPercentage,
      marginAmount,
      finalQuote: Math.round(finalQuote * 100) / 100,
    };
  };

  private getYearBasedMargin = (watchAge: number, condition: string): number => {
    if (condition === 'NEW_UNWORN' && watchAge <= 3) return 15;
    if (watchAge <= 2) return 15;
    if (watchAge <= 7) return 20;
    return 30;
  };

  private getBoxPapersMultiplier = (hasBox: boolean, hasPapers: boolean): number => {
    if (hasBox && hasPapers) return this.boxPapersMultipliers.fullSet;
    if (hasBox) return this.boxPapersMultipliers.boxOnly;
    if (hasPapers) return this.boxPapersMultipliers.papersOnly;
    return this.boxPapersMultipliers.none;
  };

  private getLiquidityMultiplier = (isHighDemand?: boolean, isLowDemand?: boolean): number => {
    if (isHighDemand) return this.liquidityMultipliers.high;
    if (isLowDemand) return this.liquidityMultipliers.low;
    return this.liquidityMultipliers.standard;
  };

  /**
   * Format breakdown for display
   */
  formatBreakdown = (breakdown: PricingBreakdown): any => {
    return {
      baseMarketPrice: `$${breakdown.baseMarketPrice.toLocaleString('en-CA', { minimumFractionDigits: 2 })}`,
      materialAdjustment: breakdown.materialMultiplier !== 1 
        ? `${breakdown.materialMultiplier > 1 ? '+' : ''}${((breakdown.materialMultiplier - 1) * 100).toFixed(0)}% (Material)` 
        : 'Standard Steel',
      conditionAdjustment: `${breakdown.conditionMultiplier < 1 ? '-' : '+'}${Math.abs((breakdown.conditionMultiplier - 1) * 100).toFixed(0)}%`,
      boxPapersAdjustment: `${breakdown.boxPapersMultiplier > 1 ? '+' : ''}${((breakdown.boxPapersMultiplier - 1) * 100).toFixed(0)}%`,
      liquidityAdjustment: breakdown.liquidityMultiplier !== 1 
        ? `${breakdown.liquidityMultiplier > 1 ? '+' : ''}${((breakdown.liquidityMultiplier - 1) * 100).toFixed(0)}%`
        : 'Standard',
      subtotal: `$${breakdown.subtotal.toLocaleString('en-CA', { minimumFractionDigits: 2 })}`,
      riskBuffer: `-$${breakdown.riskBuffer.toLocaleString('en-CA', { minimumFractionDigits: 2 })}`,
      marginInfo: `${breakdown.marginPercentage}% (${breakdown.watchAge} year${breakdown.watchAge !== 1 ? 's' : ''} old)`,
      marginAmount: `-$${breakdown.marginAmount.toLocaleString('en-CA', { minimumFractionDigits: 2 })}`,
      finalQuote: `$${breakdown.finalQuote.toLocaleString('en-CA', { minimumFractionDigits: 2 })}`,
    };
  };

  isHighDemandBrand = (brand: string): boolean => {
    const highDemandBrands = ['rolex', 'patek philippe', 'audemars piguet', 'richard mille'];
    return highDemandBrands.includes(brand.toLowerCase());
  };
}

export const pricingCalculator = new PricingCalculator();