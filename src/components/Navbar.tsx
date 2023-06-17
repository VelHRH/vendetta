import Link from "next/link";

const Navbar = () => {
 return (
  <div className="fixed bg-black text-white h-80 w-full flex justify-between">
   <Link href="/" className="flex gap-2">
    <p>Logo</p>
    <p>Vendetta</p>
   </Link>
   <p>Login</p>
  </div>
 );
};

export default Navbar;
