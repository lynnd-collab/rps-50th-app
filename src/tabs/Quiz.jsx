import WhoAmI from '../components/WhoAmI'
import RenalTrivia from '../components/RenalTrivia'

export default function Quiz() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <WhoAmI />
      <div className="pb-56">
        <RenalTrivia />
      </div>
    </div>
  )
}
