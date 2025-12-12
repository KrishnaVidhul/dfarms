'use server';

import { createQualityTest, createBatch, getBatchById, updateBatchStatus } from '../lib/db';
import { revalidatePath } from 'next/cache';

export async function submitQualityTest(formData: FormData) {
    const batchId = Number(formData.get('batchId'));
    const moisture = Number(formData.get('moisture'));
    const foreignMatter = Number(formData.get('foreignMatter'));

    if (isNaN(batchId) || isNaN(moisture) || moisture < 0 || moisture > 100 || isNaN(foreignMatter) || foreignMatter < 0) {
        return { error: 'Invalid readings' };
    }

    // Logic: Moisture > 12 is FAIL (Needs Drying)
    const status = moisture > 12 ? 'FAIL' : 'PASS';

    const result = await createQualityTest({
        batch_id: batchId,
        moisture_percent: moisture,
        foreign_matter_percent: foreignMatter,
        status: status
    });

    if (result.success) {
        revalidatePath('/app/quality');
        revalidatePath('/app/inventory'); // Inventory might update status
        return { message: `Test saved. Status: ${status} ${status === 'FAIL' ? '(Auto-flagged for Drying)' : ''}` };
    } else {
        return { error: 'Failed to save test' };
    }
}

export async function addBatch(formData: FormData) {
    const commodityId = Number(formData.get('commodityId'));
    const quantity = Number(formData.get('quantity'));
    const price = Number(formData.get('price'));

    if (isNaN(quantity) || quantity <= 0 || isNaN(price) || price < 0) {
        return { error: 'Invalid input' };
    }
    // Generate Code: B-{Timestamp}
    const code = `B-${Math.floor(Date.now() / 1000).toString().slice(-4)}`;

    const result = await createBatch({
        commodity_id: commodityId,
        batch_code: code,
        quantity: quantity,
        purchase_price: price,
        current_stage: 'RAW',
        yield_percent: 0
    });

    if (result.success) {
        revalidatePath('/app/inventory');
        revalidatePath('/app'); // Update Dashboard too
        return { success: true };
    } else {
        return { error: 'Failed' };
    }
}

export async function processBatchAction(formData: FormData) {
    const batchId = Number(formData.get('batchId'));
    const outputQty = Number(formData.get('outputQty'));

    if (isNaN(batchId) || isNaN(outputQty) || outputQty < 0) {
        return { error: 'Invalid input' };
    }

    const batch = await getBatchById(batchId);
    if (!batch) return { error: 'Batch not found' };

    // Calculate Yield based on ORIGINAL weight
    // weight_in_kg is the original purchase weight.
    // quantity is current weight (which might have been reduced if partially processed? No, assuming 1:1 batch flow).
    const originalWeight = parseFloat(batch.weight_in_kg);
    if (originalWeight <= 0) return { error: 'Invalid batch weight' };

    const yieldPercent = (outputQty / originalWeight) * 100;

    // Validate realism? > 100% possible if water absorbed? 
    // Usually < 100 for Milling.

    const result = await updateBatchStatus(batchId, 'PROCESSED', outputQty, yieldPercent);

    if (result.success) {
        revalidatePath('/app/inventory');
        revalidatePath('/app'); // Dashboard Yield Chart needs this
        return { success: true };
    } else {
        return { error: 'Update failed' };
    }
}
