import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold">הדף לא נמצא</h1>
      <Link to="/" className="mt-4 inline-block text-blue hover:underline">
        חזרה לכל המפגשים
      </Link>
    </div>
  )
}
