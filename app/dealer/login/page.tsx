import Link from 'next/link';

export default function DealerLoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-primary mb-4">Dealer Login</h1>
        <p className="text-gray-600 mb-6">
          The dealer portal is currently under development.
        </p>
        <p className="text-gray-600 mb-8">
          For dealer access, please contact:
          <br />
          <a href="mailto:dealers@masterpiece.com" className="text-primary font-semibold hover:underline">
            dealers@masterpiece.com
          </a>
        </p>
        <Link href="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    </div>
  );
}