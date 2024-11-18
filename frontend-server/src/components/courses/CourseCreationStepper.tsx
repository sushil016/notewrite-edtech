interface CourseCreationStepperProps {
  currentStep: number;
}

export function CourseCreationStepper({ currentStep }: CourseCreationStepperProps) {
  const steps = [
    { number: 1, title: 'Course Details' },
    { number: 2, title: 'Course Content' },
    { number: 3, title: 'Course Media' }
  ];

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div
              className={`rounded-full h-8 w-8 flex items-center justify-center ${
                currentStep >= step.number
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step.number}
            </div>
            <span className="ml-2 text-sm font-medium">{step.title}</span>
            {index < steps.length - 1 && (
              <div
                className={`h-1 w-16 mx-4 ${
                  currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 