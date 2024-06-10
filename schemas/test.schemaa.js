const providerSchema =
{
    categories: [
    ],
    descriptor: {
        name: "Test - ",
        short_desc: "Test ",
        images: [
            {
                size_type: "sm",
                url: "https://sunbird.org/images/sunbird-logo-new.png"
            }
        ]
    },
    id: "Test",
    items: [
    ],
    fulfillments: [
        {
            agent: {
                person: {
                    name: ""
                },
                contact: {
                    email: ""
                }
            }
        }
    ]
}


const itemSchema = {
    category_ids: [
    ],
    creator: {
        descriptor: {
            name: 'mentor.name'
        }
    },
    descriptor: {
        long_desc: "Long description of the item",
        name: 'trainerFirstName',
        short_desc: "short desc"
    },
    display: true,
    id: 'identifier',
    price: {
        currency: "INR",
        value: "0"
    },
    quantity: {
        maximum: {
            count: 1
        }
    },
    rateable: true,
    rating: "0",
    tags: [
        {
            descriptor: {
                code: "content-metadata",
                name: "Content metadata"
            },
            list: [
                {
                    descriptor: {
                        code: "learner-level",
                        name: "Learner level"
                    },
                    value: "Beginner"
                },
                {
                    descriptor: {
                        code: "learning-objective",
                        name: "Learning objective"
                    },
                    value: "By the end of the course, learners will confidently navigate everyday conversations, demonstrating improved fluency, cultural awareness, and effective communication skills."
                }
            ]
        }
    ]
}

const transformSchema = {
    courses: {
      type: 'type',
      id: 'id',
      name: 'name',
      mentor: (course, context) => {
        const mentor = context.users.find((user) => user.id === course.mentorId);
        return mentor ? { id: mentor.id, name: mentor.name } : null;
      },
      batch: (course, context) => {
        const batch = context.batchess.find(
          (batch) => batch.id === course.batchId
        );
        return batch ? { id: batch.id, name: batch.name } : null;
      },
      text: (course, context) => {
        const text = context.text.find((text) => text.id === course.tId);
        return text ? { id: text.id, name: text.name } : null;
      },
    },
  };
const transformPath = 'response'

const responsePath = 'response.courses'
const urlPath='http://127.0.0.1:3022/response3.json'

module.exports = { providerSchema, itemSchema, responsePath,urlPath ,transformSchema,transformPath};
