const providerSchema =
{
    categories: [
        {
            descriptor: {
                code: "LANGUAGE-COURSES",
                name: "Language Courses"
            },
            id: "LANGUAGE-COURSES"
        },
        {
            id: "SKILL-DEVELOPMENT-COURSES",
            descriptor: {
                code: "SKILL-DEVELOPMENT-COURSES",
                name: "Skill development Courses"
            }
        },
    ],
    descriptor: {
        name: "Astrika",
        short_desc: "Astrika Content",
        images: [
            {
                size_type: "sm",
                url: "https://sunbird.org/images/sunbird-logo-new.png"
            }
        ]
    },
    id: "Astrika",
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

const creatorSchema= {
    descriptor: {
        name: 'creator',
        short_desc:'orgDetails.orgName'
    },
}


const orderCreatorSchema= {
    descriptor: {
        name: 'firstName'+'lastName',
        short_desc:'orgDetails.orgName'
    },
}

const orderSchema= {
    customer:orderCreatorSchema
}

const itemSchema = {
    category_ids: [
    ],
    creator:creatorSchema,
    descriptor: {
        long_desc: "Long description of the item",
        name: 'name',
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

const responsePath='result.content'

const urlPath='http://127.0.0.1:3022/response2.json'

const urlConfig = {
    url: 'https://aastrika-stage.tarento.com/apis/public/v8/courseRecommendation/publicSearch/getcourse',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      query: 'asha',
      language: 'en'
    }
  };
module.exports = { providerSchema, itemSchema ,responsePath,urlConfig};
