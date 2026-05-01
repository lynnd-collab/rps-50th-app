import WhoAmI from '../components/WhoAmI'
import RenalTrivia from '../components/RenalTrivia'
import NephroWordle from '../components/NephroWordle'

export default function Quiz() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <WhoAmI />
      <RenalTrivia />
      <div className="pb-56">
        <NephroWordle />
      </div>
    </div>
  )
}
