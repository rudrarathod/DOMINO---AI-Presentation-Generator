import React from "react";
import { Slide } from "../../services/ai";
import { CoverSlide } from "./CoverSlide";
import { ProblemSlide } from "./ProblemSlide";
import { SolutionSlide } from "./SolutionSlide";
import { MarketSlide } from "./MarketSlide";
import { ProductSlide } from "./ProductSlide";
import { BusinessModelSlide } from "./BusinessModelSlide";
import { CompetitionSlide } from "./CompetitionSlide";
import { FinancialsSlide } from "./FinancialsSlide";
import { RoadmapSlide } from "./RoadmapSlide";
import { TeamSlide } from "./TeamSlide";
import { GenericSlide } from "./GenericSlide";

export { CoverSlide } from "./CoverSlide";
export { ProblemSlide } from "./ProblemSlide";
export { SolutionSlide } from "./SolutionSlide";
export { MarketSlide } from "./MarketSlide";
export { ProductSlide } from "./ProductSlide";
export { BusinessModelSlide } from "./BusinessModelSlide";
export { CompetitionSlide } from "./CompetitionSlide";
export { FinancialsSlide } from "./FinancialsSlide";
export { RoadmapSlide } from "./RoadmapSlide";
export { TeamSlide } from "./TeamSlide";
export { GenericSlide } from "./GenericSlide";
export { DynamicIcon } from "./DynamicIcon";

export function SlideContent({
  slideIndex,
  slide,
  onSlideDataUpdate,
}: {
  slideIndex: number;
  slide: Slide;
  onSlideDataUpdate?: (newData: any) => void;
}) {
  const content = (type: string, data: any, color: string) => {
    switch (type) {
      case 'cover':
        return <CoverSlide gradient={color} data={data} onDataUpdate={onSlideDataUpdate} />;
      case 'problem':
        return <ProblemSlide data={data} />;
      case 'solution':
        return <SolutionSlide data={data} onDataUpdate={onSlideDataUpdate} />;
      case 'market':
        return <MarketSlide data={data} />;
      case 'product':
        return <ProductSlide data={data} onDataUpdate={onSlideDataUpdate} />;
      case 'business_model':
        return <BusinessModelSlide data={data} />;
      case 'competition':
        return <CompetitionSlide data={data} />;
      case 'financials':
        return <FinancialsSlide data={data} />;
      case 'roadmap':
        return <RoadmapSlide data={data} />;
      case 'team':
        return <TeamSlide data={data} onDataUpdate={onSlideDataUpdate} />;
      case 'generic':
      default:
        return <GenericSlide data={data} />;
    }
  };

  return content(slide.type, slide.data, slide.color);
}
