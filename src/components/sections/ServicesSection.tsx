import { User, Users, Home, Briefcase, Heart, Video } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AnimatedSection } from '@/components/common/AnimatedSection'
import { SectionContainer } from '@/components/common/SectionContainer'
import { SERVICES } from '@/lib/constants'

const iconMap = {
  user: User,
  users: Users,
  home: Home,
  briefcase: Briefcase,
  heart: Heart,
  video: Video,
}

export function ServicesSection() {
  return (
    <SectionContainer id="services" className="bg-muted/30">
      <AnimatedSection className="mb-12 text-center">
        <h2 className="mb-4 font-display text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          Our Services
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          We offer a comprehensive range of counselling services tailored to meet your unique needs
          and support your mental wellness journey.
        </p>
      </AnimatedSection>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((service, index) => {
          const Icon = iconMap[service.icon as keyof typeof iconMap]
          return (
            <AnimatedSection key={service.title} delay={index * 0.1}>
              <Card className="h-full transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardContent>
              </Card>
            </AnimatedSection>
          )
        })}
      </div>
    </SectionContainer>
  )
}
