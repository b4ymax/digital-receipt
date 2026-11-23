<?php

declare(strict_types=1);

namespace App\Http\Controllers\Dashboard;

use App\Actions\Dashboard\ProvideDashboardProps;
use App\Data\Dashboard\DashboardFilterData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\DashboardFilterRequest;
use Inertia\Inertia;
use Inertia\Response;

final class DashboardController extends Controller
{
    public function index(DashboardFilterRequest $request, ProvideDashboardProps $provideDashboardProps): Response
    {
        $data = DashboardFilterData::from($request->validated());

        return Inertia::render('dashboard', $provideDashboardProps->handle($data));
    }
}
