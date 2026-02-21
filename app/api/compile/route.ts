/**
 * API Route: /api/compile
 * Compiles Solidity templates server-side and returns ABI + bytecode
 */

import { NextRequest, NextResponse } from 'next/server';
import { getTemplate, getTemplateInfo } from '@/lib/contracts/templates';
import { compileSolidity } from '@/lib/contracts/compiler';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { template, params, customSource, customContractName } = body;

    // Option 1: Compile custom source code
    if (customSource && customContractName) {
      const result = compileSolidity(customSource, customContractName);

      if (!result.success) {
        return NextResponse.json(result, { status: 400 });
      }

      return NextResponse.json(result);
    }

    // Option 2: Compile from template
    if (!template) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please specify a template or provide custom source code',
          availableTemplates: getTemplateInfo(),
        },
        { status: 400 }
      );
    }

    const templateDef = getTemplate(template);
    if (!templateDef) {
      return NextResponse.json(
        {
          success: false,
          error: `Unknown template: ${template}`,
          availableTemplates: getTemplateInfo(),
        },
        { status: 400 }
      );
    }

    // Validate required params
    const missingParams = templateDef.params
      .filter((p) => p.required)
      .filter((p) => !params || !(p.name in params));

    if (missingParams.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing required parameters: ${missingParams.map((p) => p.name).join(', ')}`,
          template,
          requiredParams: templateDef.params,
        },
        { status: 400 }
      );
    }

    // Generate source from template
    const { source, contractName } = templateDef.generate(params || {});

    // Compile
    const result = compileSolidity(source, contractName);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json({
      ...result,
      template,
      params,
    });
  } catch (error) {
    console.error('[/api/compile] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/** GET: Return available templates */
export async function GET() {
  return NextResponse.json({
    success: true,
    templates: getTemplateInfo(),
  });
}
