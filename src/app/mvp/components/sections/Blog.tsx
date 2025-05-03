// Blog.tsx
import React from 'react';
import Card from '../ui/Card';
import ImagePlaceholder from '../ui/ImagePlaceholder';
import Typography from '../ui/Typography';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  imageUrl?: string;
  tags?: string[];
  href?: string;
}

interface BlogProps {
  title?: string;
  posts?: BlogPost[];
}

const Blog: React.FC<BlogProps> = ({
  title = 'The Blog',
  posts = [
    {
      id: '1',
      title:
        'The Emotional Regulation Playlist: Using Music to Shift Your Mood',
      excerpt:
        'Music has a unique way of shaping our emotions. Songs can bring back memories, set a mood, and...',
      tags: ['emotional regulation', 'mood'],
      href: '#article-1',
    },
    {
      id: '2',
      title: "Rigid Minds Can't Laugh: How humor can break the cycle of trauma",
      excerpt:
        'What do you do when you feel lost and stressed? Do you go for a run and activate...',
      tags: ['humor', 'trauma'],
      href: '#article-2',
    },
    {
      id: '3',
      title:
        'Trouble in the Bedroom: Creating solutions for differences in sexual needs and wants',
      excerpt:
        'Recently, I was asked one of the most common questions in sex- and couples therapy: "After X years[!]...',
      tags: ['relationships', 'sex therapy'],
      href: '#article-3',
    },
  ],
}) => {
  return (
    <section className="bg-secondary-cream py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Typography variant="h2" className="mb-12 text-center">
          {title}
        </Typography>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {posts.map((post, index) => (
            <Card key={post.id} variant="default" className="rounded-lg">
              <div className="aspect-w-16 aspect-h-9 mb-4">
                <ImagePlaceholder
                  width={400}
                  height={250}
                  alt={post.title}
                  className="size-full object-cover"
                  rounded="lg"
                />
              </div>

              <Card.Body>
                <Typography variant="h3" className="mb-3">
                  {post.title}
                </Typography>

                <Typography
                  variant="body"
                  color="secondary"
                  className="mb-4 line-clamp-3"
                >
                  {post.excerpt}
                </Typography>
              </Card.Body>

              <Card.Footer>
                <a
                  href={post.href}
                  className="text-primary-blue hover:text-primary-blue/80 inline-flex items-center gap-1 transition-colors"
                >
                  <span>Read the article</span>
                  <span>→</span>
                </a>
              </Card.Footer>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
