<?php

$ruleset = new TwigCsFixer\Ruleset\Ruleset();
$ruleset->addStandard(new TwigCsFixer\Standard\TwigCsFixer());

$config = new TwigCsFixer\Config\Config();
$config->setRuleset($ruleset);
$config->setFinder(
    TwigCsFixer\File\Finder::create()
        ->in(__DIR__.'/templates')
);

return $config;
