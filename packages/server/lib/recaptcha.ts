import { config } from '@/config'

import { BadRequestError } from './errors'

export const validateRecaptcha = async (token: string | undefined, threshold = 0.5) => {
    if (!token) throw new BadRequestError('Something went wrong, please try again')

    const {
        RECAPTCHA_PRIVATE_KEY: privateKey,
        RECAPTCHA_SITE_KEY: siteKey,
        RECAPTCHA_PROJECT_NAME: projectName,
    } = config

    const res = await fetch(
        `https://recaptchaenterprise.googleapis.com/v1/projects/${projectName}/assessments?key=${privateKey}`,
        {
            method: 'POST',
            body: JSON.stringify({
                event: {
                    token,
                    expectedAction: 'USER_ACTION',
                    siteKey,
                },
            }),
        },
    )
    const data = (await res.json()) as { riskAnalysis: { score?: number } }
    const score = data.riskAnalysis.score

    if (!score || score < threshold) throw new BadRequestError('Something went wrong, please try again')
}
