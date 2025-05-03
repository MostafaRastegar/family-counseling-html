// UIComponentsShowcase.tsx
import React from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ImagePlaceholder from '../components/ui/ImagePlaceholder';
import Typography from '../components/ui/Typography';

const UIComponentsShowcase = () => {
  return (
    <div className="mx-auto max-w-7xl space-y-12 p-6">
      {/* Typography Section */}
      <section>
        <Typography variant="h2" className="mb-8">
          Typography Components
        </Typography>
        <div className="space-y-4">
          <Typography variant="h1">H1 Heading</Typography>
          <Typography variant="h2">H2 Heading</Typography>
          <Typography variant="h3">H3 Heading</Typography>
          <Typography variant="h4">H4 Heading</Typography>
          <Typography variant="body">
            Regular body text for paragraphs and content.
          </Typography>
          <Typography variant="bodyLarge">
            Large body text for emphasis.
          </Typography>
          <Typography variant="caption">
            Caption text for small details.
          </Typography>
        </div>
      </section>

      {/* Button Section */}
      <section>
        <Typography variant="h2" className="mb-8">
          Button Components
        </Typography>
        <div className="mb-6 flex flex-wrap gap-4">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="text">Text Button</Button>
        </div>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" size="sm">
            Small
          </Button>
          <Button variant="primary" size="md">
            Medium
          </Button>
          <Button variant="primary" size="lg">
            Large
          </Button>
        </div>
      </section>

      {/* Card Section */}
      <section>
        <Typography variant="h2" className="mb-8">
          Card Components
        </Typography>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card variant="default">
            <Card.Header>
              <Typography variant="h3">Default Card</Typography>
            </Card.Header>
            <Card.Body>
              <Typography variant="body">
                This is a default card with minimal styling.
              </Typography>
            </Card.Body>
            <Card.Footer>
              <Button size="sm">Action</Button>
            </Card.Footer>
          </Card>

          <Card variant="elevated">
            <Card.Header>
              <Typography variant="h3">Elevated Card</Typography>
            </Card.Header>
            <Card.Body>
              <Typography variant="body">
                This card has shadow and hover effects.
              </Typography>
            </Card.Body>
            <Card.Footer>
              <Button size="sm">Action</Button>
            </Card.Footer>
          </Card>

          <Card variant="bordered">
            <Card.Header>
              <Typography variant="h3">Bordered Card</Typography>
            </Card.Header>
            <Card.Body>
              <Typography variant="body">
                This card has border styling.
              </Typography>
            </Card.Body>
            <Card.Footer>
              <Button size="sm">Action</Button>
            </Card.Footer>
          </Card>
        </div>
      </section>

      {/* Image Placeholder Section */}
      <section>
        <Typography variant="h2" className="mb-8">
          Image Placeholder Components
        </Typography>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <Typography variant="h4" className="mb-4">
              Square Placeholder
            </Typography>
            <ImagePlaceholder width={300} height={300} rounded="md" />
          </div>
          <div>
            <Typography variant="h4" className="mb-4">
              Rectangle Placeholder
            </Typography>
            <ImagePlaceholder width={400} height={250} rounded="lg" />
          </div>
          <div>
            <Typography variant="h4" className="mb-4">
              Circle Placeholder
            </Typography>
            <ImagePlaceholder width={200} height={200} rounded="full" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default UIComponentsShowcase;
