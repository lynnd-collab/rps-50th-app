import WhoAmI from '../components/WhoAmI'
import RenalTrivia from '../components/RenalTrivia'
import NephroWordle from '../components/NephroWordle'
import NephroCrossword from '../components/NephroCrossword'

export default function Quiz() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <WhoAmI />
      <RenalTrivia />
      <NephroWordle />
      <div className="pb-56">
        <NephroCrossword />
      </div>
    </div>
  )
}
