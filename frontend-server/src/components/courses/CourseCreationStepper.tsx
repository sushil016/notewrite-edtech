interface CourseCreationStepperProps {
  currentStep: number;
}

export function CourseCreationStepper({ currentStep }: CourseCreationStepperProps) {
  const steps = [
    { number: 1, title: 'Course Details' },
    { number: 2, title: 'Course Sections' },
    { number: 3, title: 'Course Content' }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto mb-12">
      <div className="relative flex justify-between">
        {/* Progress Bar */}
        <div className="absolute top-1/2 w-full h-1 bg-gray-200 -z-10">
          <div 
            className="absolute top-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        {steps.map((step, index) => (
          <div key={step.number} className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm mb-2
                ${currentStep >= step.number 
                  ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-gray-200 text-gray-500'
                } transition-all duration-500`}
            >
              {step.number}
            </div>
            <span className={`text-sm font-medium ${
              currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'
            }`}>
              {step.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
} 