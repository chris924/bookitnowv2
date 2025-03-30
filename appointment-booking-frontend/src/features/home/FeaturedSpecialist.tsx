import Autoplay from "embla-carousel-autoplay"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../../components/ui/carousel"
import React from "react"
import { Card, CardContent } from "../../components/ui/card"
import { BaseItemInterface } from "@/components/ui/own/base-search-form";

interface searchResultPropInterface
{
  specialists: BaseItemInterface[]
}


export default function FeaturedSpecialist({specialists}: searchResultPropInterface)
{
    const plugin = React.useRef(
        Autoplay({ delay: 3000, stopOnInteraction: false })
      )
    return(

        <Carousel
        opts={{
            align: "start",
            slidesToScroll: 1
          }}
      plugins={[plugin.current]}
      className="w-full max-w-xs md:max-w-3xl "
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
       {specialists.map((result : BaseItemInterface, index : number) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 ">
                  <div className="p-1 flex justify-center flex-col">
                    <Card className=" border-amber-300">
                      <CardContent className="flex flex-col aspect-square items-center justify-center p-6 space-y-8">
                        <img
                          src={result.image}
                          alt={result.label}
                          className="w-24 h-24 rounded-full object-cover"
                        >                     
                        </img>
                        <div className="flex flex-col items-center justify-center space-y-2">
                        <span className="text-3xl font-semibold">{result.label}</span>
                        <span className="text-1xl">{result.company}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>      
       ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
    )
}