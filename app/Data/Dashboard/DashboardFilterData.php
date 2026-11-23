<?php

declare(strict_types=1);

namespace App\Data\Dashboard;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
#[MapInputName(SnakeCaseMapper::class)]
final class DashboardFilterData extends Data
{
    public function __construct(
        public ?string $startDate,
        public ?string $endDate,
    ) {}
}
