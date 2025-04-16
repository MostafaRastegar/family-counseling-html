import { chain } from 'papak/middlewares/chain';
import { withAuthentication } from '@/middlewares/withAuthentication';

export default chain([withAuthentication]);

export const config = {
  matcher: ['/login', '/', '/:path*'],
};
