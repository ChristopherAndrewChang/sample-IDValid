import { Link, LinkProps } from 'react-router';

type PropTypes = LinkProps

export default function LinkIf(props: PropTypes) {
  return props.to
    ? <Link {...props} />
    : props.children
}