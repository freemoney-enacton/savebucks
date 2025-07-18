<?php

namespace App\Filament\Resources;

use App\Filament\Resources\BlockResource\Pages;
use App\Filament\Resources\BlockResource\RelationManagers;
use App\Models\Block;
use Filament\Forms;
use Filament\Forms\Components\Builder as ComponentsBuilder;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
// use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Resources\Concerns\Translatable;
use Filament\Tables\Enums\FiltersLayout;
use Filament\Tables\Filters\QueryBuilder\Constraints\SelectConstraint;
use Filament\Tables\Filters\QueryBuilder\Constraints\TextConstraint;
use Z3d0X\FilamentFabricator\Forms\Components\PageBuilder;
use App\BuilderBlocks;
use App\Enums\ContentStatus;
use Filament\Forms\Components\Section;

class BlockResource extends Resource
{
    protected static ?string $model = Block::class;
    use Translatable;

    protected static ?int $navigationSort = 2;
    protected static ?string $navigationGroup = "CMS";
    protected static ?string $navigationLabel = 'Blocks';
    protected static ?string $navigationIcon = 'heroicon-o-squares-plus';
    protected static ?string $modelLabel = 'Blocks';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make('general')
                    ->heading("Block Details")
                    ->columns(2)
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('purpose')
                            ->disabledOn('edit')
                            ->unique(ignoreRecord: true)
                            ->required()
                            ->maxLength(255),
                        Forms\Components\Radio::make('status')
                            ->options(ContentStatus::class)->inline()->inlineLabel(false)
                            ->default('publish')
                            ->inline()
                            ->inlineLabel(false),
                    ]),

                Section::make('content')
                    ->heading("Block Content")
                    ->schema([
                        ComponentsBuilder::make('blocks')
                            ->hiddenLabel()
                            ->blocks([
                                ComponentsBuilder\Block::make('heading')
                                    ->schema(BuilderBlocks::heading())
                                    ->columns(2),
                                ComponentsBuilder\Block::make('stats-mini-without-icons')->label('Stats Mini Without Icons')
                                    ->schema(BuilderBlocks::statsMiniWithoutIcons()),
                                ComponentsBuilder\Block::make('login-component')
                                    ->schema(BuilderBlocks::loginComponent()),
                                ComponentsBuilder\Block::make('stats-col-with-icons')->label('Stats Col With Icons')
                                    ->schema(BuilderBlocks::statsColWithIcons()),
                                ComponentsBuilder\Block::make('info-box-col')->label('Info Box Col')
                                    ->schema(BuilderBlocks::infoBoxCol()),
                                ComponentsBuilder\Block::make('hiw-cards-with-left-image')->label('How It Works Cards With Left Image')
                                    ->schema(BuilderBlocks::howItWorksCardsWithLeftImage()),
                                ComponentsBuilder\Block::make('info-box-with-cta')->label('Info Box With CTA')
                                    ->schema(BuilderBlocks::infoBoxWithCTA()),
                                ComponentsBuilder\Block::make('review-component')->label('Review Component')
                                    ->schema(BuilderBlocks::reviewComponent()),
                                ComponentsBuilder\Block::make('faqs-component')->label('FAQs Component')
                                    ->schema(BuilderBlocks::faqsComponent()),
                                ComponentsBuilder\Block::make('sign-up-cta')->label('Sign Up CTA')
                                    ->schema(BuilderBlocks::signUpCta()),
                                ComponentsBuilder\Block::make('testimonials')->label('Testimonials')
                                    ->schema(BuilderBlocks::testimonials()),
                                ComponentsBuilder\Block::make('info-box-with-bg-image-and-cta')->label('Info Box With CTA')->schema(BuilderBlocks::infoBoxWithBgImageAndCTA()),
                                ComponentsBuilder\Block::make('sign-up-cta-with-bg-image')->label('Sign Up CTA With Background Image')->schema(BuilderBlocks::signUpCtaWithBgImage()),
                                ComponentsBuilder\Block::make('hero-section-with-image')->label('Hero Section With Image')->schema(BuilderBlocks::heroSectionWithImage()),
                                ComponentsBuilder\Block::make('payment-options')->label('Payment Options')->schema(BuilderBlocks::paymentOptions()),
                                ComponentsBuilder\Block::make('how-it-works-wothout-image')->label('How It Works Without Image')->schema(BuilderBlocks::howItWorksWithoutImage()),
                                ComponentsBuilder\Block::make('teams-and-conditions')->label('Teams And Conditions')->schema(BuilderBlocks::teamsAndConditions()),
                                ComponentsBuilder\Block::make('rich-editor')->label('Rich Editor')->schema(BuilderBlocks::richTextEditor()),
                            ])->maxItems(1)
                    ])

            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->limit(100)
                    ->tooltip(fn($state) => $state)
                    ->sortable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('purpose')
                    ->limit(100)
                    ->tooltip(fn($state) => $state)
                    ->toggleable()
                    ->sortable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('status')
                    ->badge(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->native(false)
                    ->label(__('Status'))
                    ->options(ContentStatus::class),
            ])
            ->actions([
                Tables\Actions\EditAction::make()->label("")->tooltip('Edit')->size("xl"),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListBlocks::route('/'),
            'create' => Pages\CreateBlock::route('/create'),
            'edit' => Pages\EditBlock::route('/{record}/edit'),
        ];
    }

    // public static function getEloquentQuery(): Builder
    // {
    // return parent::getEloquentQuery()
    //     ->withoutGlobalScopes([
    //         SoftDeletingScope::class,
    //     ]);
    // }
}
