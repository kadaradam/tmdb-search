import NextLink, { LinkProps } from 'next/link';
import { forwardRef } from 'react';

const LinkBehaviour = forwardRef<HTMLAnchorElement, LinkProps>(
	function LinkBehaviour(props, ref) {
		return <NextLink ref={ref} {...props} />;
	}
);

export default LinkBehaviour;
